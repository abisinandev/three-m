import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { ICandle } from "@infrastructure/databases/mongo_db/models/interfaces/stocks/stock-candle-schema.interface";
import { CandleDocument, CandleModel } from "@infrastructure/databases/mongo_db/models/schemas/stock-candle.schema";
import { IStockCandleRepository } from "@application/interfaces/repositories/stock/stock-candle-repository.interface";
import { CandleMapper } from "@infrastructure/mappers/stock/candle.mapper";
import { CandleEntity } from "@domain/entities/stock/candle.entity";

@injectable()
export class StockCandleRepository extends BaseRepository<CandleEntity, CandleDocument> implements IStockCandleRepository {
    constructor() {
        super(CandleModel, CandleMapper);
    }

    async save(candle: ICandle): Promise<void> {
        try {
            await this.model.updateOne(
                { symbol: candle.symbol, timeframe: candle.timeframe, time: candle.time },
                { $set: candle },
                { upsert: true }
            );
        } catch (error) {
            console.error("Error saving candle:", error);
            throw error;
        }
    }

    async findBySymbolAndTimeframe(symbol: string, timeframe: string, limit: number = 100): Promise<ICandle[]> {
        return await this.model.find({ symbol, timeframe })
            .sort({ time: -1 })
            .limit(limit)
            .lean();
    }
}
