export interface ICandle {
    symbol: string;
    timeframe: string;
    time: number; // Unix timestamp in seconds
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    isComplete: boolean;
}
