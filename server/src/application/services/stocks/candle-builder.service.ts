import { injectable } from "inversify";
import { Trade } from "@application/dto/stocks/stock.dto";
import { Candle } from "@domain/entities/stock/candle.entity";

@injectable()
export class CandleBuilderService {
    private currentCandle: Map<string, Candle> = new Map();
    private updateSubscribers: ((candle: Candle) => void)[] = [];
    private completionSubscribers: ((candle: Candle) => void)[] = [];

    public processTrade(trade: Trade) {
        const timestamp = trade.timestamp; // assuming ms from Finnhub or convert if needed
        // Assuming Trade timestamp is in ms. If it's in seconds, change this math.
        const tradeTimeMs = timestamp;
        // Group into 1-minute bucket (floor to nearest minute)
        const bucketTime = Math.floor(tradeTimeMs / 60000) * 60; // in seconds

        let candle = this.currentCandle.get(trade.symbol);

        if (!candle) {
            candle = {
                symbol: trade.symbol,
                timeframe: "1m",
                time: bucketTime,
                open: trade.price,
                high: trade.price,
                low: trade.price,
                close: trade.price,
                volume: trade.volume || 0, // Finnhub trade object might need volume property. Wait, existing Trade dto only has price and timestamp. Let's handle if volume is missing.
            };
            this.currentCandle.set(trade.symbol, candle);
        } else if (candle.time !== bucketTime) {
            // we moved to a new minute, stringify the last fully closed candle before resetting
            this.emitCompleted(candle);
            
            // Re-initialize for new minute
            candle = {
                symbol: trade.symbol,
                timeframe: "1m",
                time: bucketTime,
                open: trade.price,
                high: trade.price,
                low: trade.price,
                close: trade.price,
                volume: trade.volume || 0,
            };
            this.currentCandle.set(trade.symbol, candle);
        } else {
            // Same minute update
            candle.high = Math.max(candle.high, trade.price);
            candle.low = Math.min(candle.low, trade.price);
            candle.close = trade.price;
            candle.volume += (trade.volume || 0);
        }

        this.emitUpdate(candle);
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
}
