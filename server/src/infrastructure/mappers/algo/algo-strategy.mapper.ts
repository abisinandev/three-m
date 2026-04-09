import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";
import { AlgoStrategyDocument } from "@infrastructure/databases/mongo_db/models/schemas/algo/algo-strategy.schema";


const toDomain = (doc: AlgoStrategyDocument): AlgoStrategyEntity => {
  return AlgoStrategyEntity.fromPersistence({
    id: doc._id.toString(),
    userId: doc.userId,
    symbol: doc.symbol,
    strategyName: doc.strategyName,
    config: doc.config,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

const toPersistance = (entity: AlgoStrategyEntity): Partial<AlgoStrategyDocument> => {
  return {
    userId: entity.userId,
    symbol: entity.symbol,
    strategyName: entity.strategyName,
    config: entity.config,
    isActive: entity.isActive,
  };
}



export const AlgoStrategyMapper = {
  toDomain,
  toPersistance
}