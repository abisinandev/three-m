import { CandleCallback, ICandleEngineService } from '@application/interfaces/services/stocks/candle-engine-service.interface';
import { Trade } from "@application/dto/stocks/stock.dto";
import { inject, injectable } from 'inversify';
import { ICandle } from '@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface';
import { ITick } from '@application/dto/stocks/candle-tick';
import { EXTERNAL_TYPES } from '@infrastructure/inversify_di/features/external/external.types';
import { ICacheProvider } from '@application/interfaces/services/externals/redis-cache.provider.interface';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IStockCandleRepository } from '@application/interfaces/repositories/stock/stock-candle-repository.interface';

/**
 * Aggregates real-time trades/ticks into 1-minute OHLCV candles.
 * 
 */

@injectable()
export class CandleEngineService implements ICandleEngineService {

    private currentCandles: Map<string, ICandle> = new Map();
    private updateSubscribers: CandleCallback[] = [];
    private completeSubscribers: CandleCallback[] = [];

    constructor(
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _redisCacheProvider: ICacheProvider,
        @inject(STOCK_TYPES.StockCandleRepository) private readonly _candleRepository: IStockCandleRepository
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

        if (!candle) {
            const cached = await this._redisCacheProvider.get(`candle:1m:${symbol}`);
            if (cached) {
                try {
                const parsed = JSON.parse(cached) as ICandle;

                if (parsed.time === currentMinute) {
                    candle = parsed;
                    this.currentCandles.set(symbol, candle);
                }
                } catch (e) {
                    console.error("Failed to parse cached candle", e);
                }
            }
        }

        if (!candle) {
            candle = this.createNewCandle(symbol, price, currentMinute, volume);
            this.currentCandles.set(symbol, candle);
        } else if (candle.time < currentMinute) {
       
            candle.isComplete = true;
            this.emitUpdate(candle);
            this.emitComplete(candle);
            
            await this._candleRepository.save(candle);

            let gapTime = candle.time + 60;
            while (gapTime < currentMinute) {
                const flatCandle = this.createNewCandle(symbol, candle.close, gapTime, 0);
                flatCandle.isComplete = true;
                this.emitComplete(flatCandle);
                this.emitUpdate(flatCandle);
                
                await this._candleRepository.save(flatCandle);
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

       
        const ttl = 3600; // 1 hour

        await this._redisCacheProvider.set(`candle:1m:${symbol}`, JSON.stringify(candle), ttl);

        await this._redisCacheProvider.set(`price:${symbol}`, price, ttl);

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
