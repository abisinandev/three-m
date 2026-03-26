export interface IMarketDataProvider {
    start(symbol: string[]): void;
    getLatestPrices(symbols: string[]): Promise<Record<string, number>>;
}