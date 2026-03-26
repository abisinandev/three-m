import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IStockApiClient {
    fetchNYCStocks(): Promise<StockDTO[]>;
    // fetchBSEStocks(): Promise<StockDTO[]>;
    // fetchUSStocks(): Promise<StockDTO[]>;
}