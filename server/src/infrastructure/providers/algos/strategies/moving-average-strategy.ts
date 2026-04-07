import { Strategy, StrategyResult } from "@application/interfaces/services/algos/strategy-interfaces";

export class MovingAverageStrategy implements Strategy {
    name = "MA";

    evaluate({ priceHistory, config }: {
        symbol: string;
        priceHistory: number[];
        config: { shortPeriod: number; longPeriod: number };
    }): StrategyResult | null {

        const { shortPeriod, longPeriod } = config;

        if (priceHistory.length < longPeriod) return null;

        const shortMA = this.calculateMA(priceHistory, shortPeriod);
        const longMA = this.calculateMA(priceHistory, longPeriod);

        if (shortMA > longMA) {
            return {
                action: "BUY",
                reason: `MA crossover (short ${shortPeriod} > long ${longPeriod})`
            };
        }

        if (shortMA < longMA) {
            return {
                action: "SELL",
                reason: `MA crossover (short ${shortPeriod} < long ${longPeriod})`
            };
        }

        return null;
    }

    private calculateMA(data: number[], period: number): number {
        const slice = data.slice(-period);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / period;
    }
}