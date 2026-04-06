import { inject, injectable } from "inversify";
import { IFetchStockHoldingsUseCase } from "./interfaces/fetch-stock-holdings-usecase.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IYahooProvider } from "@application/interfaces/services/stocks/yahoo-provider.interface";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";
import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";

@injectable()
export class FetchStockHoldingsUseCase implements IFetchStockHoldingsUseCase {
    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.YahooProvider) private readonly _yahooProvider: IYahooProvider,
    ) { }

    async execute(userId: string, options: QueryOptions = {}): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options as any;

        let stockPortfolios = await this._portfolioRepository.findByUserId(userId) ?? [];

        // App-level filtering for search
        if (search) {
            stockPortfolios = stockPortfolios.filter(sp => 
                sp.symbol.toLowerCase().includes(search.toLowerCase())
            );
        }

        const totalCount = stockPortfolios.length;
        
        // App-level pagination
        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedPortfolios = stockPortfolios.slice(startIndex, startIndex + Number(limit));

        const data: InvestmentResponseDTO[] = [];

        for (const stockPf of paginatedPortfolios) {
            const stockDetails = await this._stockRepository.findBySymbol(stockPf.symbol);
            
            let currentPrice = stockPf.avgPrice;
            try {
                const quote = await this._yahooProvider.getLatestQuote(stockPf.symbol);
                if (quote) {
                    currentPrice = quote.price;
                }
            } catch (err) {
                console.error(`Error fetching quote for ${stockPf.symbol}:`, err);
            }

            const currentValue = stockPf.quantity * currentPrice;
            const profit = currentValue - stockPf.investedAmount;

            data.push({
                id: stockPf.id as string,
                userId: stockPf.userId,
                schemeCode: stockPf.symbol, // ticker
                schemeName: stockDetails?.name || stockPf.symbol,
                amount: stockPf.investedAmount,
                units: stockPf.quantity,
                nav: stockPf.avgPrice, // avg entry price
                navDate: stockPf.updatedAt || stockPf.createdAt,
                category: "Stock",
                status: InvestmentStatus.HOLDING, // Specialized status for stocks
                paymentMethod: PaymentMethod.WALLET,
                investmentType: InvestmentType.STOCK,
                logo: stockDetails?.logo || "",
                profit: profit, 
                createdAt: stockPf.createdAt,
                updatedAt: stockPf.updatedAt,
            });
        }

        return {
            data,
            page: Number(page),
            limit: Number(limit),
            totalCount,
        };
    }
}
