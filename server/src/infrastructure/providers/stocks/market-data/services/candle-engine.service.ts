import { CandleCallback, ICandleEngineService } from '@application/interfaces/services/stocks/candle-engine-service.interface';
import { Trade } from "@application/dto/stocks/stock.dto";
import { inject, injectable } from 'inversify';
import { ICandle } from '@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface';
import { ITick } from '@application/dto/stocks/candle-tick';
import { RedisCacheProvider } from '@infrastructure/providers/redis/redis-cache.provider';
import { EXTERNAL_TYPES } from '@infrastructure/inversify_di/features/external/external.types';
import { ICacheProvider } from '@application/interfaces/services/externals/redis-cache.provider.interface';

/**
 * Aggregates real-time trades/ticks into 1-minute OHLCV candles.
 *
 * - Groups data by symbol and minute
 * - Updates open, high, low, close, and volume in real time
 * - Emits updates for active candles
 * - Marks and emits candles when a minute completes
 * - Fills gaps with flat candles if no trades occur
 */
@injectable()
export class CandleEngineService implements ICandleEngineService {

    private currentCandles: Map<string, ICandle> = new Map();
    private updateSubscribers: CandleCallback[] = [];
    private completeSubscribers: CandleCallback[] = [];

    constructor(
        // @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _redisCacheProvider: ICacheProvider
    ) { }


    onCandleUpdate(callback: CandleCallback) {
        this.updateSubscribers.push(callback);
    }


    onCandleComplete(callback: CandleCallback) {
        this.completeSubscribers.push(callback);
    }


    processTrade(trade: Trade) {
        this.processUpdate(trade.symbol, trade.price, trade.timestamp, trade.volume || 0);
    }


    processTick(tick: ITick) {
        this.processUpdate(tick.symbol, tick.price, tick.timestamp, tick.volume || 0);
    }


    private async processUpdate(symbol: string, price: number, timestamp: number, volume: number) {

        const timestampSec = timestamp > 1e12 ? Math.floor(timestamp / 1000) : timestamp;
        const currentMinute = Math.floor(timestampSec / 60) * 60;

        let candle = this.currentCandles.get(symbol);

        // const cached = await this._redisCacheProvider.get(`candle:1m:${symbol}`);

        if (!candle) {

            candle = this.createNewCandle(symbol, price, currentMinute, volume);
            this.currentCandles.set(symbol, candle);

        } else if (candle.time < currentMinute) {

            candle.isComplete = true;
            this.emitUpdate(candle);
            this.emitComplete(candle);

            let gapTime = candle.time + 60;
            while (gapTime < currentMinute) {
                const flatCandle = this.createNewCandle(symbol, candle.close, gapTime, 0);
                flatCandle.isComplete = true;
                this.emitComplete(flatCandle);
                this.emitUpdate(flatCandle);
                gapTime += 60;
            }

            candle = this.createNewCandle(symbol, price, currentMinute, volume);
            this.currentCandles.set(symbol, candle);
        } else {

            candle.high = Math.max(candle.high, price);
            candle.low = Math.min(candle.low, price);
            candle.close = price;
            candle.volume += volume;
        }

        // await this._redisCacheProvider.set(`candle:1m:${symbol}`, candle,3600);

        // await this._redisCacheProvider.set(`price:${symbol}`, candle.close,3600);

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
