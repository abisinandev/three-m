import { NotificationEntity } from "@domain/entities/notification/notification.entity"
import { NotificationDocument } from "@infrastructure/databases/mongo_db/models/interfaces/notification/notification-schema.interface"
import { Types } from "mongoose";

const toDomain = (doc: NotificationDocument): NotificationEntity => {
    return NotificationEntity.fromPersistence({
        id: doc._id.toHexString(),
        userId: doc.userId.toHexString(),
        type: doc.type,
        title: doc.title,
        message: doc.message,
        read: doc.read,
        createdAt: doc.createdAt.toISOString(),
    });
};

const toPersistance = (entity: NotificationEntity): any => {
    return {
        _id: new Types.ObjectId(entity.id),
        userId: new Types.ObjectId(entity.userId),
        type: entity.type,
        title: entity.title,
        message: entity.message,
        read: entity.read,
        createdAt: new Date(entity.createdAt),
    };
};

export const NotificationMapper = {
    toDomain,
    toPersistance,
};