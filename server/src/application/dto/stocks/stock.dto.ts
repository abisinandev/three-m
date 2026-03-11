import { StocksStatus } from "@domain/entities/stock/stocks.enum"

export interface StockDTO {
    symbol: string;
    name: string;
    exchange: string;
    sector?: string;
    status: StocksStatus;
    isTradable: boolean;
}