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
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";

@injectable()
export class FetchStockHoldingsUseCase implements IFetchStockHoldingsUseCase {
    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(userId: string, options: QueryOptions): Promise<{
        data: InvestmentResponseDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, search = "" } = options;

        const filter = { assetType: AssetType.STOCK };

        const [stockPortfolios, total] = await Promise.all([
            this._portfolioRepository.findWithFilters(userId, { ...options, filter }),
            this._portfolioRepository.countWithFilters(userId, filter, search as string)
        ]);

        const data: InvestmentResponseDTO[] = [];

        for (const stockPf of stockPortfolios) {

            const stockDetails = await this._stockRepository.findById(stockPf.assetId);
            const symbol = stockDetails?.symbol || stockPf.assetId;

            let currentPrice = stockPf.avgPrice;

            const quote = await this._marketDataProvider.getLatestQuote(symbol);
            if (quote) {
                currentPrice = quote.price;
            }


            const currentValue = (stockPf.quantity ?? 0) * currentPrice;
            const profit = currentValue - stockPf.investedAmount;

            data.push({
                schemeCode: symbol,
                schemeName: stockDetails?.name || symbol,
                amount: stockPf.investedAmount,
                units: stockPf.quantity || 0,
                quantity: stockPf.quantity || 0,
                nav: stockPf.avgPrice,
                avgPrice: stockPf.avgPrice,
                currentPrice: currentPrice,
                currentValue: currentValue,
                profitPercentage: stockPf.investedAmount > 0 ? (profit / stockPf.investedAmount) * 100 : 0,
                navDate: stockPf.updatedAt || stockPf.createdAt,
                category: "Stock",
                status: InvestmentStatus.HOLDING,
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
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / (Number(limit) || 10)),
        };
    }
}
