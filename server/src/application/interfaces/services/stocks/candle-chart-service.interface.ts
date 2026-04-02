import { ICandle } from "@infrastructure/providers/stocks/market-data/interfaces/candle.interface";
import { ITick } from "@infrastructure/providers/stocks/market-data/interfaces/tick.interface";


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
}