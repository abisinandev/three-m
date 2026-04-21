import { inject, injectable } from "inversify";
import { IPortfolioSummaryUseCase } from "./interfaces/portfolio-summary-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { PortfolioXirrService } from "@domain/domain-services/portfolio/xirr-calculation.domain-service";
import { CashFlow } from "@domain/domain-services/portfolio/xirr-calculation.interface";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { InvestmentFundDTO } from "@application/dto/portfolio/aggregated-asset.dto";
import { PortfolioSummaryDTO } from "@application/dto/portfolio/portfolio-summary.dto";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";

/**
 * Handles portfolio summary calculation.
 *
 * Includes:
 * - Total investment, current value, profit, and returns
 *
 * XIRR:
 * - Calculates true annual return using combined cash flows (MF + Stocks)
 * - Considers timing of investments for accurate performance measurement
 */

@injectable()
export class PortfolioSummaryUseCase implements IPortfolioSummaryUseCase {

    private xirrService = new PortfolioXirrService();

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(userId: string): Promise<PortfolioSummaryDTO> {

        const [investments, stockPortfolios, allTrades] = await Promise.all([
            this._investmentRepository.getUserInvestementSummary(userId),
            this._portfolioRepository.findByUserId(userId),
            this._tradeRepository.findByUserId(userId)
        ]);

        if (!investments.length && !stockPortfolios.length) {
            return {
                totalCount: 0,
                totalInvestment: 0,
                totalProfit: 0,
                profitAfterSell: 0,
                totalReturns: 0,
                currentValue: 0,
                profitPercentage: 0,
                xirr: null,
            };
        }

        let totalInvestment = 0;
        let currentValue = 0;

        //Mutualfunds
        const schemeCodes = [...new Set(investments.map(i => i.schemeCode))];
        const navMap = new Map<string, number>();

        await Promise.all(
            schemeCodes.map(async (schemeCode) => {
                const navHistory = await this._navUpdateProvider.fetchNavHistories(schemeCode);
                if (navHistory?.length) {
                    navMap.set(schemeCode, Number(navHistory[0].nav));
                }
            })
        );

        for (const inv of investments) {
            totalInvestment += Number(inv.amount);
            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0) {
                const nav = navMap.get(inv.schemeCode);
                if (!nav) continue;
                currentValue += Number(inv.units) * nav;
            }
        }

        //Stocks
        const assetPriceMap = new Map<string, number>();
        const uniqueAssetIds = [...new Set(stockPortfolios.map(p => p.assetId))];

        await Promise.all(uniqueAssetIds.map(async (assetId) => {
            const stock = await this._stockRepository.findById(assetId);
            if (stock) {
                const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
                if (quote) {
                    assetPriceMap.set(assetId, quote.price);
                }

            }
        }));

        for (const stock of stockPortfolios) {
            totalInvestment += Number(stock.investedAmount);
            const stockPrice = assetPriceMap.get(stock.assetId) ?? stock.avgPrice;
            currentValue += (stock.quantity ?? 0) * stockPrice;
        }

        const totalProfit = currentValue - totalInvestment;
        const profitAfterSell = allTrades.reduce((acc, trade) => {
            if (trade.side === OrderSide.SELL && trade.profit !== undefined) {
                return acc + trade.profit;
            }
            return acc;
        }, 0);

        const totalReturns = totalProfit + profitAfterSell;
        const profitPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;

        const cashflows = await this.buildCashFlows(
            investments,
            allTrades,
            navMap,
            stockPortfolios,
            assetPriceMap,
        );

        const xirr = this.xirrService.calculate(cashflows);

        return {
            totalCount: investments.length + stockPortfolios.length,
            totalInvestment,
            totalProfit,
            profitAfterSell,
            totalReturns,
            currentValue,
            profitPercentage,
            xirr,
        };
    }

    private buildCashFlows(
        investments: InvestmentFundDTO[],
        trades: TradeEntity[],
        navMap: Map<string, number>,
        stockPortfolios: PortfolioEntity[],
        assetPriceMap: Map<string, number>
    ): CashFlow[] {
        const cashFlows: CashFlow[] = [];

        // Mutual Funds Cashflows
        let mfCurrentValue = 0;
        for (const inv of investments) {
            cashFlows.push({
                date: new Date(inv.createdAt),
                amount: -inv.amount,
            });

            if (inv.status === InvestmentStatus.REDEEMED) {
                cashFlows.push({
                    date: new Date(inv.redeemedAt || inv.updatedAt || inv.createdAt),
                    amount: inv.redeemedAmount,
                });
            } else {
                const nav = navMap.get(inv.schemeCode) || 0;
                mfCurrentValue += (inv.remainingUnits || 0) * nav;
            }
        }

        // Stocks Cashflows
        for (const trade of trades) {
            const amount = trade.quantity * trade.price;
            if (trade.side === OrderSide.BUY) {
                cashFlows.push({
                    date: new Date(trade.createdAt),
                    amount: -amount,
                });
            } else if (trade.side === OrderSide.SELL) {
                cashFlows.push({
                    date: new Date(trade.createdAt),
                    amount: amount,
                });
            }
        }

        // Portfolio Current Value 
        let stockCurrentValue = 0;
        for (const stock of stockPortfolios) {
            const price = assetPriceMap.get(stock.assetId) ?? stock.avgPrice;
            stockCurrentValue += (stock.quantity ?? 0) * price;
        }

        const totalCurrentValue = mfCurrentValue + stockCurrentValue;
        if (totalCurrentValue > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalCurrentValue,
            });
        }

        return cashFlows;
    }

}
