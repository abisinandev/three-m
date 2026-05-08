import { WatchlistEntity } from "@domain/entities/stock/watchlist.entity";
import { WatchlistDocument } from "@infrastructure/databases/mongo_db/models/schemas/stock/watchlist.schema";

export const toDomain = (doc: WatchlistDocument): WatchlistEntity => {
  return WatchlistEntity.fromPersistence({
    id: doc._id?.toString(),
    userId: doc.userId.toString(),
    symbol: doc.symbol,
    createdAt: doc.createdAt,
  });
};

export const toPersistance = (entity: WatchlistEntity): Partial<WatchlistDocument> => {
  return {
    userId: entity.userId as unknown,
    symbol: entity.symbol,
    createdAt: entity.createdAt,
  };
};

export const WatchlistMapper = {
  toDomain,
  toPersistance,
};
