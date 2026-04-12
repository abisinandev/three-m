import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { PlanDocument } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/plans-schema";
import { PlanDTO } from "@application/dto/admin/subscription/subscription-management.dto";

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

const toDTO = (entity: PlanEntity): PlanDTO => {
    return {
        id: entity.id as string,
        code: entity.code,
        price: entity.price,
        durationInDays: entity.durationInDays,
        features: entity.features,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

export const PlanMapper = {
    toDomain,
    toPersistance,
    toDTO,
};