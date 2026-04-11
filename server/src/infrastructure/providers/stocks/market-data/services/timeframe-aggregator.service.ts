import { CandleCallback } from '@application/interfaces/services/stocks/candle-chart-service.interface';
import { ICandle } from '../interfaces/candle.interface';
import { injectable } from 'inversify';

@injectable()
export class TimeframeAggregatorService {
    private activeCandles: Map<string, ICandle> = new Map();
    private updateSubscribers: CandleCallback[] = [];
    private completeSubscribers: CandleCallback[] = [];

    private timeframes = {
        '5m': 5 * 60,
        '15m': 15 * 60,
        '1h': 60 * 60,
    };

    /**
     * Subscribe to HTF candle updates
     */
    onCandleUpdate(callback: CandleCallback) {
        this.updateSubscribers.push(callback);
    }

    /**
     * Subscribe to HTF candle completions
     */
    onCandleComplete(callback: CandleCallback) {
        this.completeSubscribers.push(callback);
    }

    /**
     * Ingest a 1m candle and aggregate higher timeframes
     */
    process1mCandle(candle1m: ICandle) {
        for (const [tfName, tfSeconds] of Object.entries(this.timeframes)) {
            const tfKey = `${candle1m.symbol}:${tfName}`;
            
            // Start of the higher timeframe interval
            const tfStartTime = Math.floor(candle1m.time / tfSeconds) * tfSeconds;

            let htfCandle = this.activeCandles.get(tfKey);

            if (!htfCandle) {
                htfCandle = { 
                    ...candle1m, 
                    timeframe: tfName, 
                    time: tfStartTime, 
                    isComplete: false 
                };
                this.activeCandles.set(tfKey, htfCandle);
            } else if (htfCandle.time < tfStartTime) {
                // The previous HTF candle is now complete
                htfCandle.isComplete = true;
                this.emitUpdate(htfCandle);
                this.emitComplete(htfCandle);

                // Start new HTF candle
                htfCandle = { 
                    ...candle1m, 
                    timeframe: tfName, 
                    time: tfStartTime, 
                    isComplete: false 
                };
                this.activeCandles.set(tfKey, htfCandle);
            } else {
                // Update active HTF candle
                htfCandle.high = Math.max(htfCandle.high, candle1m.high);
                htfCandle.low = Math.min(htfCandle.low, candle1m.low);
                htfCandle.close = candle1m.close;
                htfCandle.volume += candle1m.volume || 0;
            }

            this.emitUpdate(htfCandle);
        }
    }

    private emitUpdate(candle: ICandle) {
        for (const cb of this.updateSubscribers) cb(candle);
    }

    private emitComplete(candle: ICandle) {
        for (const cb of this.completeSubscribers) cb(candle);
    }
}
