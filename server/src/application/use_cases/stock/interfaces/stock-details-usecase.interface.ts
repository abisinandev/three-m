import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IStockDetailsUseCase {
    execute(symbol: string): Promise<{ data: StockDTO, latestPrice: number | null }>;
}