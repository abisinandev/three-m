export interface QuoteDTO {
    symbol: string;
    open: number;
    high: number;
    low: number;
    price: number;
    volume: number;
    latestTradingDay: Date;
    previousClose: number;
    change: number;
    changePercent: number;
}