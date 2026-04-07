import { Strategy, StrategyResult } from "@application/interfaces/services/algos/strategy-interfaces";

export class MovingAverageStrategy implements Strategy {
    name = "MA";

    evaluate({ priceHistory, config }: {
        symbol: string;
        priceHistory: number[];
        config: { shortPeriod: number; longPeriod: number };
    }): StrategyResult | null {

        const { shortPeriod, longPeriod } = config;

        if (priceHistory.length < longPeriod + 1) return null;

        const shortMA = this.calculateMA(priceHistory, shortPeriod);
        const longMA = this.calculateMA(priceHistory, longPeriod);

        const prevPrices = priceHistory.slice(0, -1);

        const prevShortMA = this.calculateMA(prevPrices, shortPeriod);
        const prevLongMA = this.calculateMA(prevPrices, longPeriod);


        if (prevShortMA <= prevLongMA && shortMA > longMA) {
            return {
                action: "BUY",
                reason: `Bullish crossover (short MA crossed above long MA)`
            };
        }

        if (prevShortMA >= prevLongMA && shortMA < longMA) {
            return {
                action: "SELL",
                reason: `Bearish crossover (short MA crossed below long MA)`
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