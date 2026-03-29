import { IFetchStocksUseCase } from "./interfaces/fetch-stocks.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockDTO, StockQueryOptions } from "@application/dto/stocks/stock.dto";

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

        const result = await this._stockRepository.finAllStocks(safeOptions);

        const symbols = result.data.map((stock) => stock.symbol);
        let latestPrices: Record<string, number> = {};

        if (symbols.length > 0) {
            this._marketDataProvider.init();
            this._marketDataProvider.subscribe(symbols);

            latestPrices = await this._marketDataProvider.getLatestPrices(symbols);
        }

        const dataWithPrices: (StockDTO & { price: number | undefined })[] =
            result.data.map(stock => ({
                id: stock.id as string,
                symbol: stock.symbol,
                name: stock.name,
                exchange: stock.exchange,
                logo: stock.logo,
                sector: stock.sector,
                isTradable: stock.isTradable,
                isVisible: stock.isVisible,
                isTracked: stock.isTracked,

                price: latestPrices[stock.symbol] ?? null,
            }));

        return {
            ...result,
            data: dataWithPrices,
        };
        
    }
}
