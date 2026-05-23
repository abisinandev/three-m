import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IStockDetailsUseCase {
    execute(symbol: string): Promise<{ 
        data: StockDTO, 
        latestPrice: number | null, 
        change?: number | null, 
        changePercent?: number | null,
        open?: number | null,
        high?: number | null,
        low?: number | null,
        previousClose?: number | null,
        volume?: number | null
    }>;
}