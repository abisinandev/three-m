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

        const dataWithPrices = await AsyncHelper.mapWithConcurrency(
            stockDTOs,
            5,
            async (stock) => {
                const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
                return {
                    ...stock,
                    id: stock.id as string,
                    price: quote?.price ?? null
                }
            }
        );

        return {
            ...result,
            data: dataWithPrices,
        };
    }
}
