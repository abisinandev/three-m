import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";

export interface ICacheProvider {
    get(key: string): Promise<string | null>;
    set(key: string, value: string | number | ICandle, ttlSeconds: number): Promise<void>;
    setNX(
        key: string,
        value: string,
        ttlSeconds: number
    ): Promise<boolean>;

    delete(
        key: string
    ): Promise<void>;
}