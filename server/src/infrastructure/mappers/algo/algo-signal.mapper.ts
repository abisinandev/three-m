import { SignalAction, SignalStatus } from "@domain/entities/algo/enum/signal-enums";
import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { AlgoSignalDocument } from "@infrastructure/databases/mongo_db/models/schemas/algo-trading/algo-signal.schema";
import { Types } from "mongoose";

export const toDomain = (doc: AlgoSignalDocument): AlgoSignalEntity => {
    return AlgoSignalEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId.toString(),
        algoId: doc.algoId.toString(),
        symbol: doc.symbol,
        strategyName: doc.strategyName,
        action: doc.action as SignalAction,
        price: doc.price,
        reason: doc.reason,
        status: doc.status as SignalStatus,
        createdAt: doc.createdAt,
        expiresAt: doc.expiresAt,
    });
};

export const toPersistance = (entity: AlgoSignalEntity): Partial<AlgoSignalDocument> => {
    return {
        userId: new Types.ObjectId(entity.userId),
        algoId: new Types.ObjectId(entity.algoId),
        symbol: entity.symbol,
        strategyName: entity.strategyName,
        action: entity.action,
        price: entity.price,
        reason: entity.reason,
        status: entity.status,
        expiresAt: entity.expiresAt,
    };
};

export const AlgoSignalMapper = {
    toDomain,
    toPersistance,
};