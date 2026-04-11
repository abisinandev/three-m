import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { BaseRepository } from "../base.repository";
import { SubscriptionDocument, SubscriptionModel } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/subscription.schema";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { SubscriptionMapper } from "@infrastructure/mappers/subscription/subscription.mapper";

export class SubscriptionRepository extends
    BaseRepository<SubscriptionEntity, SubscriptionDocument> implements ISubscriptionRepository {

    constructor() {
        super(SubscriptionModel, SubscriptionMapper)
    }
}