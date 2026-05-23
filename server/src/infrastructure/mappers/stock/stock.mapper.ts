import { StockEntity } from "@domain/entities/stock/stock.entity";
import { StockDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock/stock.schema";

export const toDomain = (doc: StockDocument): StockEntity => {
  return StockEntity.fromPersistence({
    id: doc._id?.toString(),
    name: doc.name,
    symbol: doc.symbol,
    exchange: doc.exchange,
    sector: doc.sector,
    logo: doc.logo ?? null,
    isTradable: doc.isTradable,
    isVisible: doc.isVisible,
    createdAt: doc.createdAt,
  });
};

export const toPersistance = (entity: StockEntity): Partial<StockDocument> => {
  return {
    name: entity.name,
    symbol: entity.symbol,
    exchange: entity.exchange,
    sector: entity.sector,
    logo: entity.logo ?? undefined,
    isTradable: entity.isTradable,
    isVisible: entity.isVisible,
    createdAt: entity.createdAt,
    updatedAt: new Date(),
  };
};

export const StockMapper = {
  toDomain,
  toPersistance,
};