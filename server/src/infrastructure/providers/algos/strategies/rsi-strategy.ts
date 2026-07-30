import { Strategy, StrategyResult, StrategyConfig, RSISettings } from "@application/interfaces/services/algo-trading/strategy-interfaces";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

export class RSIStrategy implements Strategy {
    name = "RSI";

    private readonly REDIS_PREFIX = "rsi_state:";
    private readonly TTL = 24 * 60 * 60; // 24 hours

    async evaluate({ symbol, priceHistory, config }: {
        symbol: string;
        priceHistory: number[];
        config: StrategyConfig;
    }): Promise<StrategyResult | null> {

        const { period } = config as RSISettings;

        if (priceHistory.length < period + 1) return null;

        const currentRSI = this.calculateRSI(priceHistory, period);

        const key = `${this.REDIS_PREFIX}${symbol}`;
        const prevDataRaw = await redisClient.get(key);
        const prevData = prevDataRaw ? JSON.parse(prevDataRaw) : null;
        const prevRSI = prevData?.rsi;

        // Store new state
        await redisClient.set(
            key,
            JSON.stringify({ rsi: currentRSI, timestamp: Date.now() }),
            "EX",
            this.TTL
        );

        if (prevRSI === undefined || prevRSI === null) return null;

        if (prevRSI >= 30 && currentRSI < 30) {
            return {
                action: "BUY",
                reason: `RSI crossed below 30 (${currentRSI.toFixed(2)})`
            };
        }

        if (prevRSI <= 70 && currentRSI > 70) {
            return {
                action: "SELL",
                reason: `RSI crossed above 70 (${currentRSI.toFixed(2)})`
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