import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { PlanDocument } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/plans-schema";

const toDomain = (doc: PlanDocument): PlanEntity => {
    return PlanEntity.fromPersistence({
        id: doc._id?.toString(),
        code: doc.code,
        price: doc.price,
        durationInDays: doc.durationInDays,
        features: doc.features,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};

const toPersistance = (entity: PlanEntity): Partial<PlanDocument> => {
    return {
        code: entity.code,
        price: entity.price,
        durationInDays: entity.durationInDays,
        features: entity.features,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        updatedAt: new Date(),
    };
};

export const PlanMapper = {
    toDomain,
    toPersistance,
};