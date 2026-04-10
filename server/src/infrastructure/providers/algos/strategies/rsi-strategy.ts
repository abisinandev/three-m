import { Strategy, StrategyResult } from "@application/interfaces/services/algo-trading/strategy-interfaces";

export class RSIStrategy implements Strategy {
    name = "RSI";

    evaluate({ priceHistory, config }: {
        symbol: string;
        priceHistory: number[];
        config: any;
    }): StrategyResult | null {

        const { period } = config;

        if (priceHistory.length < period + 1) return null;

        const rsi = this.calculateRSI(priceHistory, period);

        if (rsi < 30) {
            return {
                action: "BUY",
                reason: `RSI oversold (${rsi.toFixed(2)})`
            };
        }

        if (rsi > 70) {
            return {
                action: "SELL",
                reason: `RSI overbought (${rsi.toFixed(2)})`
            };
        }

        return null;
    }

    private calculateRSI(prices: number[], period: number): number {
        let gains = 0;
        let losses = 0;

        for (let i = prices.length - period; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1];

            if (diff > 0) gains += diff;
            else losses += Math.abs(diff);
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        return 100 - 100 / (1 + rs);
    }
}