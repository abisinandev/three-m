import { ICandle } from "@infrastructure/providers/stocks/market-data/interfaces/candle.interface";

export type Interval = '1m' | '5m' | '15m' | '1h' | '1d';
export interface IHistoricalDataParams {
    symbol: string;
    period1: number;
    period2: number;
    interval?: Interval;
}

export interface IQuote {
    price: number;
    timestamp: number;
}

export interface IYahooProvider {

    getHistoricalData(params: IHistoricalDataParams): Promise<ICandle[]>;

    getLatestQuote(symbol: string): Promise<IQuote | null>;
}