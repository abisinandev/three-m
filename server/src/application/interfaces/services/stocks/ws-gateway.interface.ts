import { CandleEntity } from "@domain/entities/stock/candle.entity";

export interface IWsGateway {
    broadcastToSubscribers(candle: CandleEntity): void;
    broadcastPriceUpdate(symbol: string, price: number): void;
}