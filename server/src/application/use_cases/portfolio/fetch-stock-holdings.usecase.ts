import { inject, injectable } from "inversify";
import { IFetchStockHoldingsUseCase } from "./interfaces/fetch-stock-holdings-usecase.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { QueryOptions } from "mongoose";
import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

@injectable()
export class FetchStockHoldingsUseCase implements IFetchStockHoldingsUseCase {
    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(userId: string, options: QueryOptions = {}): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options as any;

        let stockPortfolios = await this._portfolioRepository.findByUserId(userId) ?? [];

        if (search) {
            stockPortfolios = stockPortfolios.filter(sp =>
                sp.symbol.toLowerCase().includes(search.toLowerCase())
            );
        }

        const totalCount = stockPortfolios.length;

        const startIndex = (Number(page) - 1) * Number(limit);
        const paginatedPortfolios = stockPortfolios.slice(startIndex, startIndex + Number(limit));

        const data: InvestmentResponseDTO[] = [];

        for (const stockPf of paginatedPortfolios) {
            const stockDetails = await this._stockRepository.findBySymbol(stockPf.symbol);

            let currentPrice = stockPf.avgPrice;
            try {
                const quote = await this._marketDataProvider.getLatestQuote(stockPf.symbol);
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
