import { IStockDetailsUseCase } from "./interfaces/stock-details-usecase.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { StockDTO } from "@application/dto/stocks/stock.dto";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import { IYahooProvider } from "@application/interfaces/services/stocks/yahoo-provider.interface";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { HttpStatus } from "@domain/enum/express/status-code";

@injectable()
export class StockDetailsUseCase implements IStockDetailsUseCase {
    constructor(
        @inject(STOCK_TYPES.YahooProvider) private readonly yahooProvider: IYahooProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(symbol: string): Promise<{ data: StockDTO; latestPrice: number | null }> {
        const stock = await this._stockRepository.findBySymbol(symbol);

        if (!stock || !stock.isVisible) {
            throw new AppError(
                ErrorMessages.STOCKS.FAILED_TO_FETCH,
                HttpStatus.BAD_GATEWAY
            );
        }

        const quote = await this.yahooProvider.getLatestQuote(symbol);

        return {
            data: StockMapper.toDTO(stock),
            latestPrice: quote?.price ?? null,
        };
    }
}