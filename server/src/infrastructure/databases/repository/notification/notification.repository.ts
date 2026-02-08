import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "../base.repository";
import { NotificationDocument } from "@infrastructure/databases/mongo_db/models/interfaces/notification/notification-schema.interface";
import { INotificationReposiory } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NotificationMapper } from "@infrastructure/mappers/notification/notification.mapper";
import { NotificationModel } from "@infrastructure/databases/mongo_db/models/schemas/notification-schema/notification-schema";

export class NotificationRepository extends BaseRepository<NotificationEntity,NotificationDocument> implements INotificationReposiory{

    constructor() {
        super(NotificationModel,NotificationMapper)
    }

    
}