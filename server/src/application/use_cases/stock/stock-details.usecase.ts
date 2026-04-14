import { IStockDetailsUseCase } from "./interfaces/stock-details-usecase.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { StockDTO } from "@application/dto/stocks/stock.dto";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { HttpStatus } from "@domain/enum/express/status-code";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

@injectable()
export class StockDetailsUseCase implements IStockDetailsUseCase {
    constructor(
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(symbol: string): Promise<{
        data: StockDTO;
        latestPrice: number | null,
        change: number | null,
        changePercent: number | null,
        open: number | null,
        high: number | null,
        low: number | null,
        previousClose: number | null,
        volume: number | null,
    }> {
        const stock = await this._stockRepository.findBySymbol(symbol);

        if (!stock || !stock.isVisible) {
            throw new AppError(
                ErrorMessages.STOCKS.FAILED_TO_FETCH,
                HttpStatus.BAD_GATEWAY
            );
        }

        const quote = await this._marketDataProvider.getLatestQuote(symbol);

        return {
            data: StockMapper.toDTO(stock),
            latestPrice: quote?.price ?? null,
            change: quote?.change ?? null,
            changePercent: quote?.changePercent ?? null,
            open: quote?.open ?? null,
            high: quote?.high ?? null,
            low: quote?.low ?? null,
            previousClose: quote?.previousClose ?? null,
            volume: quote?.volume ?? null,
        };
    }
}