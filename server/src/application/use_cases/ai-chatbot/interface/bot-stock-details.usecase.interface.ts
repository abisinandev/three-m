import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IBotStockDetailsUseCase {
    execute(symbol: string): Promise<{
        stock: StockDTO;
        price: number | null;
        change: number | null;
        changePercent: number | null;
        high: number | null;
        low: number | null;
    } | null>;
}
