import { StockDTO, StockQueryOptions } from "@application/dto/stocks/stock.dto";

export interface IFetchStocksUseCase {
    execute(options: StockQueryOptions): Promise<{ data: (StockDTO & { price?: number })[], total: number }>;
}