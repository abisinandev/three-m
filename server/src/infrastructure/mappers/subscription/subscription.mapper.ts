import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { SubscriptionDocument } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/subscription.schema";

const toDomain = (doc: SubscriptionDocument): SubscriptionEntity => {
    return SubscriptionEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId,
        plans: doc.plans,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    });
};

const toPersistance = (entity: SubscriptionEntity): Partial<SubscriptionDocument> => {
    return {
        userId: entity.userId,
        plans: entity.plans,
        startDate: entity.startDate,
        endDate: entity.endDate,
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: new Date(),
    };
};

export const SubscriptionMapper = {
    toDomain,
    toPersistance,
};