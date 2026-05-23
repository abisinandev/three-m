import { ITick } from "@application/dto/stocks/candle-tick";
import { Trade } from "@application/dto/stocks/stock.dto";
import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";


export type CandleCallback = (candle: ICandle) => void;

export interface ICandleEngineService {
    /**
     * Subscribe to real-time candle updates (every tick update)
     */
    onCandleUpdate(callback: CandleCallback): void;

    /**
     * Subscribe to completed candles (1m candle close)
     */
    onCandleComplete(callback: CandleCallback): void;

    /**
     * Process an incoming market tick
     */
    processTick(tick: ITick): void;

    processTrade(trade: Trade): void;
}