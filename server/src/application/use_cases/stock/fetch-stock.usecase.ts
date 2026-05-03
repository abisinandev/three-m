import { IFetchStocksUseCase } from "./interfaces/fetch-stocks.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { AsyncHelper } from "@shared/utils/stocks/concurrency.helper";

@injectable()
export class FetchStocksUseCase implements IFetchStocksUseCase {

    constructor(
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(options: StockQueryOptions) {
        
        const safeOptions: StockQueryOptions = {
            ...options,
            isVisible: true,
        };

        const result = await this._stockRepository.findAllStocks(safeOptions);

        const stockDTOs = StockMapper.toDTOList(result.data);

        const now = Math.floor(Date.now() / 1000);
        const sevenDaysAgo = now - (7 * 24 * 60 * 60);

        const dataWithPrices = await AsyncHelper.mapWithConcurrency(
            stockDTOs,
            5,
            async (stock) => {
                const [quote, history] = await Promise.all([
                    this._marketDataProvider.getLatestQuote(stock.symbol),
                    this._marketDataProvider.getPriceHistory({
                        symbol: stock.symbol,
                        period1: sevenDaysAgo,
                        period2: now,
                        interval: '1d'
                    }).catch(() => [])
                ]);

                return {
                    ...stock,
                    id: stock.id as string,
                    price: quote?.price ?? null,
                    change: quote?.change ?? 0,
                    changePercent: quote?.changePercent ?? 0,
                    history: history ?? []
                }
            }
        );


        return {
            ...result,
            data: dataWithPrices,
        };
    }
}
