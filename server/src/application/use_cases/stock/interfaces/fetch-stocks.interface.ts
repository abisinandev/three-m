import { StockDTO } from "@application/dto/stocks/stock.dto";

export interface IFetchStocks {
    execute(filters: { search?: string, exchange?: string }, page: number, limit: number): Promise<any>;
}