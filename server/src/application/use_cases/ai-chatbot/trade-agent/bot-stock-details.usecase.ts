import { inject, injectable } from "inversify";
import { IBotStockDetailsUseCase } from "../interface/bot-stock-details.usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { StockMapper } from "@application/mappers/stock/stock.mapper";

@injectable()
export class BotStockDetailsUseCase implements IBotStockDetailsUseCase {
    constructor(
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(symbol: string) {
        const stock = await this._stockRepository.findBySymbol(symbol);
        if (!stock || !stock.isVisible) return null;

        const quote = await this._marketDataProvider.getLatestQuote(symbol);

        return {
            stock: StockMapper.toDTO(stock),
            price: quote?.price ?? null,
            change: quote?.change ?? null,
            changePercent: quote?.changePercent ?? null,
            high: quote?.high ?? null,
            low: quote?.low ?? null,
        };
    }
}
