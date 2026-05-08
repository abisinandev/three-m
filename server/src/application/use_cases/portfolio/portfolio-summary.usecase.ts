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
import { PortfolioSummaryDTO } from "@application/dto/portfolio/portfolio-summary.dto";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";


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
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cache: ICacheProvider,
    ) { }

    async execute(userId: string): Promise<PortfolioSummaryDTO> {

        const [portfolioAssets, allInvestments, allTrades] = await Promise.all([
            this._portfolioRepository.getUserAssets(userId),
            this._investmentRepository.findUserInvestmentsForXirr(userId),
            this._tradeRepository.findByUserId(userId)
        ]);

        const investments = allInvestments || [];
        const trades = allTrades || [];

        if (!portfolioAssets.length) {
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
        let stockAllocation = 0;
        let mfAllocation = 0;

        const assetInfoMap = new Map<string, { symbol?: string, schemeCode?: string, name: string }>();
        const priceMap = new Map<string, number>();

        await Promise.all(portfolioAssets.map(async (asset) => {
            if (asset.assetType === "STOCK") {
                const stock = await this._stockRepository.findById(asset.assetId);
                if (stock) {
                    assetInfoMap.set(asset.assetId, { symbol: stock.symbol, name: stock.name });

                    const cacheKey = `stock-price-cache:${stock.symbol}`;
                    const cachedPrice = await this._cache.get(cacheKey);
                    if (cachedPrice) {
                        priceMap.set(asset.assetId, Number(cachedPrice));
                    } else {
                        const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
                        if (quote) {
                            priceMap.set(asset.assetId, quote.price);
                            await this._cache.set(cacheKey, quote.price.toString(), 1800); // 30 min cache
                        }
                    }
                }
            } else if (asset.assetType === "MUTUAL_FUND") {
                const fund = await this._mutualFundRepository.findById(asset.assetId);
                if (fund) {
                    assetInfoMap.set(asset.assetId, { schemeCode: fund.schemeCode, name: fund.schemeName });

                    const cacheKey = `nav-cache:${fund.schemeCode}`;
                    const cachedNav = await this._cache.get(cacheKey);
                    if (cachedNav) {
                        priceMap.set(asset.assetId, Number(cachedNav));
                    } else {
                        const navHistory = await this._navUpdateProvider.fetchNavHistories(fund.schemeCode);
                        if (navHistory?.length) {
                            const latestNav = Number(navHistory[0].nav);
                            priceMap.set(asset.assetId, latestNav);
                            await this._cache.set(cacheKey, latestNav.toString(), 3600); // 1 hour cache
                        }
                    }
                }
            }
        }));

        for (const asset of portfolioAssets) {
            totalInvestment += asset.investedAmount;
            const currentPrice = priceMap.get(asset.assetId) ?? asset.avgPrice;
            const quantity = asset.quantity || asset.units || 0;
            const value = quantity * currentPrice;
            currentValue += value;

            if (asset.assetType === "STOCK") {
                stockAllocation += value;
            } else if (asset.assetType === "MUTUAL_FUND") {
                mfAllocation += value;
            }
        }

        const stockRealizedProfit = trades.reduce((acc, trade) => {
            if (trade.side === OrderSide.SELL && trade.profit !== undefined) {
                return acc + trade.profit;
            }
            return acc;
        }, 0);

        const mfRealizedProfit = investments.reduce((acc, inv) => {
            if (inv.status === "REDEEMED" || inv.status === "PARTIALLY_REDEEMED") {

                const costOfRedeemedUnits = (inv.redeemedUnits || 0) * Number(inv.nav);
                return acc + (inv.redeemedAmount || 0) - costOfRedeemedUnits;
            }
            return acc;
        }, 0);

        const profitAfterSell = stockRealizedProfit + mfRealizedProfit;

        const totalProfit = currentValue - totalInvestment;
        const totalReturns = totalProfit + profitAfterSell;

        console.log('Current: ', currentValue, totalInvestment);

        console.log('Total: ', totalProfit, totalReturns,)

        const profitPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;
        console.log("profitPercentage: ", investments);


        // XIRR Calculation
        const cashflows = await this.buildCashFlows(
            investments,
            trades,
            portfolioAssets,
            priceMap
        );

        const xirr = this.xirrService.calculate(cashflows);

        const allocations = [
            { assetType: "STOCK", currentValue: stockAllocation },
            { assetType: "MUTUAL_FUND", currentValue: mfAllocation }
        ].filter(a => a.currentValue > 0);

        return {
            totalCount: portfolioAssets.length,
            totalInvestment,
            totalProfit,
            profitAfterSell,
            totalReturns,
            currentValue,
            profitPercentage,
            xirr,
            allocations,
        };
    }

    private buildCashFlows(
        investments: Record<string, unknown>[],
        trades: TradeEntity[],
        portfolioAssets: PortfolioEntity[],
        priceMap: Map<string, number>
    ): CashFlow[] {
        const cashFlows: CashFlow[] = [];

        // Mutual Funds Cashflows
        for (const inv of investments) {

            // Inflow
            cashFlows.push({
                date: new Date(inv.createdAt as string),
                amount: -(inv.amount as number),
            });

            // Outflow
            if (inv.status === InvestmentStatus.REDEEMED || inv.status === InvestmentStatus.PARTIALLY_REDEEMED) {
                if (inv.redeemedAmount && inv.redeemedAt) {
                    cashFlows.push({
                        date: new Date(inv.redeemedAt as string),
                        amount: Number(inv.redeemedAmount),
                    });
                }
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

        let totalCurrentValue = 0;
        for (const asset of portfolioAssets) {
            const currentPrice = priceMap.get(asset.assetId) ?? asset.avgPrice;
            const quantity = asset.quantity || asset.units || 0;
            totalCurrentValue += quantity * currentPrice;
        }

        if (totalCurrentValue > 0) {
            cashFlows.push({
                date: new Date(),
                amount: totalCurrentValue,
            });
        }

        return cashFlows;
    }

}
