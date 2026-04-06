import { inject, injectable } from "inversify";
import { IPortfolioCalculationsUseCase } from "./interfaces/portfolio-calculations-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IYahooProvider } from "@application/interfaces/services/stocks/yahoo-provider.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";

@injectable()
export class PortfolioCalculationsUseCase implements IPortfolioCalculationsUseCase {

    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.YahooProvider) private readonly _yahooProvider: IYahooProvider,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
    ) { }

    async execute(userId: string): Promise<{
        totalCount: number;
        totalInvestment: number;
        totalProfit: number;
        realizedProfit: number;
        totalReturns: number;
        profitPercentage: number;
        currentValue: number;
    }> {

        const investments = await this._investmentRepository.getUserInvestmentsWithoutFilter(userId) ?? [];
        const stockPortfolios = await this._portfolioRepository.findByUserId(userId) ?? [];

        if (!investments.length && !stockPortfolios.length) {
            return {
                totalCount: 0,
                totalInvestment: 0,
                totalProfit: 0,
                realizedProfit: 0,
                totalReturns: 0,
                currentValue: 0,
                profitPercentage: 0,
            };
        }

        let totalInvestment = 0;
        let currentValue = 0;

        // --- MUTUAL FUNDS ---
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

        // --- STOCKS ---
        for (const stock of stockPortfolios) {
            totalInvestment += Number(stock.investedAmount);
            
            // Fetch real-time price if possible
            let stockPrice = stock.avgPrice; // Fallback
            try {
                const quote = await this._yahooProvider.getLatestQuote(stock.symbol);
                if (quote) {
                    stockPrice = quote.price;
                }
            } catch (err) {
                console.error(`Error fetching quote for ${stock.symbol}:`, err);
            }
            
            currentValue += stock.quantity * stockPrice;
        }

        const totalProfit = currentValue - totalInvestment; // Unrealized

        // Calculate Realized Profit from Trades
        const allTrades = await this._tradeRepository.findByUserId(userId);
        const realizedProfit = allTrades.reduce((acc, trade) => {
            if (trade.side === OrderSide.SELL && trade.profit !== undefined) {
                return acc + trade.profit;
            }
            return acc;
        }, 0);

        const totalReturns = totalProfit + realizedProfit;
        const profitPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;

        return {
            totalCount: investments.length + stockPortfolios.length,
            totalInvestment,
            totalProfit,
            realizedProfit,
            totalReturns,
            currentValue,
            profitPercentage,
        };
    }
}
