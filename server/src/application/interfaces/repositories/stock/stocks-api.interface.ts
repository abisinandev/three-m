import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IStockApiClient {
    fetchNSEStocks(): Promise<StockDTO[]>;
    // fetchBSEStocks(): Promise<StockDTO[]>;
    // fetchUSStocks(): Promise<StockDTO[]>;
}