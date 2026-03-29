export interface IMarketDataProvider {
    init(): void;
    subscribe(symbol: string[]): void;
    getLatestPrices(symbols: string[]): Promise<Record<string, number>>;
}