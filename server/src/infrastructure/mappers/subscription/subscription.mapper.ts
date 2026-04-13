import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { SubscriptionDocument } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/subscription.schema";
import { Types } from "mongoose";

const toDomain = (doc: SubscriptionDocument): SubscriptionEntity => {
    return SubscriptionEntity.fromPersistence({
        id: doc._id?.toString(),
        userId: doc.userId.toString(),
        planCode: doc.planCode,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    });
};

const toPersistance = (entity: SubscriptionEntity): Partial<SubscriptionDocument> => {
    return {
        userId: new Types.ObjectId(entity.userId),
        planCode: entity.planCode,
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