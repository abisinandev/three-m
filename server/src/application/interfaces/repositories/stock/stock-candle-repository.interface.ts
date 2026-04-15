import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";

export interface IStockCandleRepository {
    save(candle: ICandle): Promise<void>;
    findBySymbolAndTimeframe(symbol: string, timeframe: string, limit?: number): Promise<ICandle[]>;
    // Add other methods as needed for historical data fetching
}
