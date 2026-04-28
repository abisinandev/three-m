export interface StrategyResult {
    action: "BUY" | "SELL";
    reason: string;
}

export interface Strategy {
    name: string;

    evaluate(params: {
        symbol: string;
        priceHistory: number[];
        config: any;
    }): Promise<StrategyResult | null>;
}