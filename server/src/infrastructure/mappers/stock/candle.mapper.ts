import { CandleEntity } from "@domain/entities/stock/candle.entity";
import { CandleDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock-candle.schema";

export const toDomain = (doc: CandleDocument): CandleEntity => {
  return CandleEntity.create({
    symbol: doc.symbol,
    timeframe: doc.timeframe,
    time: doc.time,
    open: doc.open,
    high: doc.high,
    low: doc.low,
    close: doc.close,
    volume: doc.volume,
  });
};

export const toPersistance = (entity: CandleEntity): Partial<CandleDocument> => {
  return {
    symbol: entity.symbol,
    timeframe: entity.timeframe,
    time: entity.time,
    open: entity.open,
    high: entity.high,
    low: entity.low,
    close: entity.close,
    volume: entity.volume,
  };
};

export const CandleMapper = {
  toDomain,
  toPersistance,
};
