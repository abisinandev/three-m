import { inject, injectable } from "inversify";
import { IFetchWatchlistUseCase } from "./interfaces/fetch-watchlist-usecase.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IWatchlistRepository } from "@application/interfaces/repositories/stock/watchlist-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockDTO } from "@application/dto/stocks/stock.dto";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

@injectable()
export class FetchWatchlistUseCase implements IFetchWatchlistUseCase {
    constructor(
        @inject(STOCK_TYPES.WatchlistRepository) private readonly _watchlistRepository: IWatchlistRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,

    ) { }

    async execute(userId: string): Promise<StockDTO[]> {
        const watchlist = await this._watchlistRepository.findAllByUserId(userId);
        if (watchlist.length === 0) return [];

        const stocks: StockDTO[] = [];
        for (const item of watchlist) {
            const stock = await this._stockRepository.findBySymbol(item.symbol);
            const quote = await this._marketDataProvider.getLatestQuote(item.symbol);

            if (stock) {
                stocks.push({
                    id: stock.id as string,
                    name: stock.name,
                    symbol: stock.symbol,
                    exchange: stock.exchange,
                    sector: stock.sector,
                    price: quote?.price,
                    logo: stock.logo,
                    isTradable: stock.isTradable,
                    isVisible: stock.isVisible,
                    isTracked: stock.isTracked
                });
            }
        }

        return stocks;
    }
}
