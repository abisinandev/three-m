import { CandleCallback, ICandleEngineService } from '@application/interfaces/services/stocks/candle-chart-service.interface';
import { ICandle } from '../interfaces/candle.interface';
import { ITick } from '../interfaces/tick.interface';
import { Trade } from "@application/dto/stocks/stock.dto";
import { injectable } from 'inversify';

@injectable()
export class CandleEngineService implements ICandleEngineService {
    private currentCandles: Map<string, ICandle> = new Map();
    private updateSubscribers: CandleCallback[] = [];
    private completeSubscribers: CandleCallback[] = [];

    /**
     * Subscribe to every update of a candle (used for real-time charting)
     */
    onCandleUpdate(callback: CandleCallback) {
        this.updateSubscribers.push(callback);
    }

    /**
     * Subscribe only when a 1m candle fully closes
     */
    onCandleComplete(callback: CandleCallback) {
        this.completeSubscribers.push(callback);
    }

    /**
     * Process an incoming trade from WebSocket
     */
    processTrade(trade: Trade) {
        this.processUpdate(trade.symbol, trade.price, trade.timestamp, trade.volume || 0);
    }

    /**
     * Process an incoming tick from polling service
     */
    processTick(tick: ITick) {
        this.processUpdate(tick.symbol, tick.price, tick.timestamp, tick.volume || 0);
    }

    /**
     * Common logic for building 1-minute candles from raw data
     */
    private processUpdate(symbol: string, price: number, timestamp: number, volume: number) {
        // Normalize timestamp to start of minute (Unix seconds)
        // If timestamp is ms, convert to seconds first.
        const timestampSec = timestamp > 1e12 ? Math.floor(timestamp / 1000) : timestamp;
        const currentMinute = Math.floor(timestampSec / 60) * 60;

        let candle = this.currentCandles.get(symbol);

        if (!candle) {
            candle = this.createNewCandle(symbol, price, currentMinute, volume);
            this.currentCandles.set(symbol, candle);
        } else if (candle.time < currentMinute) {
            // New minute started, seal and emit old candle
            candle.isComplete = true;
            this.emitComplete(candle);

            // Handle potential gaps by filling them with "no-trade" candles
            let gapTime = candle.time + 60;
            while (gapTime < currentMinute) {
                const flatCandle = this.createNewCandle(symbol, candle.close, gapTime, 0);
                flatCandle.isComplete = true;
                this.emitComplete(flatCandle);
                this.emitUpdate(flatCandle);
                gapTime += 60;
            }

            // Create new active candle
            candle = this.createNewCandle(symbol, price, currentMinute, volume);
            this.currentCandles.set(symbol, candle);
        } else {
            // Update existing candle for the same minute
            candle.high = Math.max(candle.high, price);
            candle.low = Math.min(candle.low, price);
            candle.close = price;
            candle.volume += volume;
        }

        this.emitUpdate(candle);
    }

    private createNewCandle(symbol: string, price: number, time: number, volume: number): ICandle {
        return {
            symbol,
            timeframe: '1m',
            time,
            open: price,
            high: price,
            low: price,
            close: price,
            volume,
            isComplete: false
        };
    }

    private emitUpdate(candle: ICandle) {
        for (const cb of this.updateSubscribers) cb(candle);
    }

    private emitComplete(candle: ICandle) {
        for (const cb of this.completeSubscribers) cb(candle);
    }
}
