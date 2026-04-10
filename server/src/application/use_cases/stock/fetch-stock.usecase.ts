import { IFetchStocksUseCase } from "./interfaces/fetch-stocks.interface";
import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { StockDTO, StockQueryOptions } from "@application/dto/stocks/stock.dto";
import { StockMapper } from "@application/mappers/stock/stock.mapper";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

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

        const stockDTOs = StockMapper.toDTOList(result.data);
        const dataWithPrices = await this.attachPrices(stockDTOs);

        return {
            ...result,
            data: dataWithPrices,
        };
    }

    private async attachPrices(stocks: StockDTO[]) {
        const CONCURRENCY_LIMIT = 5;

        const chunks = this.chunkArray(stocks, CONCURRENCY_LIMIT);
        const results: (StockDTO & { price: number | null })[] = [];

        for (const chunk of chunks) {
            const chunkResults = await Promise.all(
                chunk.map((stock) => this.mapStockWithPrice(stock))
            );
            results.push(...chunkResults);
        }

        return results;
    }

    private async mapStockWithPrice(stock: StockDTO): Promise<StockDTO & { price: number | null }> {

        let price: number | null = null;

        try {
            const quote = await this._marketDataProvider.getLatestQuote(stock.symbol);
            price = quote?.price ?? null;
        } catch (error) {
            // TODO: Replace with proper logger (Winston/Pino)
            console.error(`Failed to fetch price for ${stock.symbol}`, error);
        }

        return {
            ...stock,
            id: stock.id as string,
            price,
        };
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];

        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }

        return chunks;
    }
}
