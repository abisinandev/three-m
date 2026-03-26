import { IFetchStocks } from "./interfaces/fetch-stocks.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";

@injectable()
export class FetchStocks implements IFetchStocks {

    constructor(
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
    ) { }

    async execute(filters: { search?: string, exchange?: string }, page: number, limit: number) {
        const safeFilters = {
            ...filters,
            isVisible: true
        };

        const skip = (page - 1) * limit;
        const result = await this._stockRepository.findFilteredPaginated(safeFilters, skip, limit);

        const symbols = result.data.map((stock: any) => stock.symbol);
        let latestPrices: Record<string, number> = {};

        if (symbols.length > 0) {
            this._marketDataProvider.start(symbols);
            latestPrices = await this._marketDataProvider.getLatestPrices(symbols);
        }

        // Voodoo logic: Override static DB prices with Real-Time Redis Caches before shipping to Client!
        const dataWithPrices = result.data.map((stock: any) => {
            // Unpack mongoose doc if necessary to mutate payload safely
            const doc = stock.toObject ? stock.toObject() : stock;
            if (latestPrices[doc.symbol]) {
                doc.price = latestPrices[doc.symbol];
            }
            return doc;
        });

        return {
            ...result,
            data: dataWithPrices
        };
    }
}