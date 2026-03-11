import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock/stock.schema";
import { StocksStatus } from "@domain/entities/stock/stocks.enum";

export const toDomain = (doc: StockDocument): StockEntity => {
  return StockEntity.fromPersistence({
    id: doc._id?.toString(),
    name: doc.name,
    symbol: doc.symbol,
    exchange: doc.exchange,
    sector: doc.sector,
    status: doc.status as StocksStatus,
    isTradable: doc.isTradable,
    createdAt: doc.createdAt,
  });
};

export const toPersistance = (entity: StockEntity): Partial<StockDocument> => {
  return {
    name: entity.name,
    symbol: entity.symbol,
    exchange: entity.exchange,
    sector: entity.sector,
    status: entity.status as StocksStatus,
    isTradable: entity.isTradable,
    createdAt: entity.createdAt,
    updatedAt: new Date(),
  };
};

export const StockMapper = {
  toDomain,
  toPersistance,
};