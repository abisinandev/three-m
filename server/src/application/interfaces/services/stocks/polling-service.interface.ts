export interface IPollingService {
    /**
     * Start the polling loop
     */
    start(): void;

    /**
     * Stop the polling loop
     */
    stop(): void;

    /**
     * Add a symbol to the polling watchlist
     */
    addSymbol(symbol: string): void;

    /**
     * Remove a symbol from the polling watchlist
     */
    removeSymbol(symbol: string): void;
}