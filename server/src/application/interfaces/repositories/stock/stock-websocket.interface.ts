import { Trade } from "@application/dto/stocks/stock.dto";

export interface IStockWebsocketProvider {
    connect(): void;
    subscribe(symbol: string): void;
    unsubscribe(symbol: string): void;
    onTrade(callback: (trade: Trade) => void): void;
}