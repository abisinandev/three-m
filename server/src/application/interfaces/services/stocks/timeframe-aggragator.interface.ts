import { CandleCallback } from '@application/interfaces/services/stocks/candle-engine-service.interface';
import { ICandle } from '@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface';

export interface ITimeframeAggregatorService {
    /**
     * Subscribe to real-time updates of higher timeframe candles
     */
    onCandleUpdate(callback: CandleCallback): void;

    /**
     * Subscribe to completed higher timeframe candles
     */
    onCandleComplete(callback: CandleCallback): void;

    /**
     * Process incoming 1-minute candle and aggregate into higher timeframes
     */
    process1mCandle(candle1m: ICandle): void;
}