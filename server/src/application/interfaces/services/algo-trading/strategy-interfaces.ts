export interface StrategyResult {
    action: "BUY" | "SELL";
    reason: string;
}

export interface RSISettings {
    period: number;
    overbought: number;
    oversold: number;
}

export interface MovingAverageSettings {
    shortPeriod: number;
    longPeriod: number;
}

export type StrategyConfig = RSISettings | MovingAverageSettings | Record<string, unknown>;

export interface Strategy {
    name: string;

    evaluate(params: {
        symbol: string;
        priceHistory: number[];
        config: StrategyConfig;
    }): Promise<StrategyResult | null>;
}