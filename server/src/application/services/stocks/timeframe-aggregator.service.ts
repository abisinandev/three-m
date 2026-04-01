import { injectable, inject } from "inversify";
import { Trade } from "@application/dto/stocks/stock.dto";
import { Candle } from "@domain/entities/stock/candle.entity";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";

export const TIMEFRAMES: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600
};

@injectable()
export class TimeframeAggregatorService {
    // symbol -> timeframe -> partially built candle
    private aggregators: Map<string, Map<string, Candle>> = new Map();
    private updateSubscribers: ((candle: Candle) => void)[] = [];
    private completionSubscribers: ((candle: Candle) => void)[] = [];

    constructor(
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly redis: ICacheProvider
    ) {}

    public processTrade(trade: Trade) {
        Object.keys(TIMEFRAMES).forEach(timeframe => {
            if (timeframe === "1m") return;

            this.aggregateTradeTo(trade, timeframe);
        });
    }

    private aggregateTradeTo(trade: Trade, timeframe: string) {
        const symbol = trade.symbol;
        const bucketSizeSec = TIMEFRAMES[timeframe];
        const tradeTimeSec = Math.floor(trade.timestamp / 1000); // Assuming Finnhub timestamp is in ms, if it's already s we shouldn't divide by 1000. Wait, Finnhub trade timestamp `t` is ms.
        // Wait, looking at CandleBuilderService, it uses tradeTimeMs / 60000 * 60 which assumes timestamp is in ms.
        // Let's use the exact same thing: Math.floor(trade.timestamp / 1000) for seconds.
        // Actually, CandleBuilderService uses: Math.floor(trade.timestamp / 60000) * 60;
        const tradeTimeSecs = Math.floor(trade.timestamp / 1000); 
        const bucketTime = Math.floor(tradeTimeSecs / bucketSizeSec) * bucketSizeSec;

        if (!this.aggregators.has(symbol)) {
            this.aggregators.set(symbol, new Map());
        }

        const symbolAggregators = this.aggregators.get(symbol)!;
        let currentAggregatedCandle = symbolAggregators.get(timeframe);

        if (!currentAggregatedCandle) {
            currentAggregatedCandle = {
                symbol,
                timeframe,
                time: bucketTime,
                open: trade.price,
                high: trade.price,
                low: trade.price,
                close: trade.price,
                volume: trade.volume || 0,
            };
            symbolAggregators.set(timeframe, currentAggregatedCandle);
        } else if (currentAggregatedCandle.time !== bucketTime) {
            // Reached new timeframe bucket. Emit previous completed candle
            this.emitCompleted(currentAggregatedCandle);
            this.cacheCandle(currentAggregatedCandle);

            // create new one
            currentAggregatedCandle = {
                symbol,
                timeframe,
                time: bucketTime,
                open: trade.price,
                high: trade.price,
                low: trade.price,
                close: trade.price,
                volume: trade.volume || 0,
            };
            symbolAggregators.set(timeframe, currentAggregatedCandle);
        } else {
            // update existing
            currentAggregatedCandle.high = Math.max(currentAggregatedCandle.high, trade.price);
            currentAggregatedCandle.low = Math.min(currentAggregatedCandle.low, trade.price);
            currentAggregatedCandle.close = trade.price;
            currentAggregatedCandle.volume += (trade.volume || 0);
        }

        // emit update for real-time visualization of unfinished candles
        this.emitUpdate(currentAggregatedCandle);
    }

    public onCandleUpdate(callback: (candle: Candle) => void) {
        this.updateSubscribers.push(callback);
    }

    public onCandleCompleted(callback: (candle: Candle) => void) {
        this.completionSubscribers.push(callback);
    }

    private emitUpdate(candle: Candle) {
        for (const sub of this.updateSubscribers) {
            sub(candle);
        }
    }

    private emitCompleted(candle: Candle) {
        for (const sub of this.completionSubscribers) {
            sub(candle);
        }
    }

    private async cacheCandle(candle: Candle) {
        const key = `candle:${candle.symbol}:${candle.timeframe}`;
        // Store just the latest candle for real-time recovery, expiry 24 hours
        await this.redis.set(key, JSON.stringify(candle), 24 * 60 * 60);
    }
}
