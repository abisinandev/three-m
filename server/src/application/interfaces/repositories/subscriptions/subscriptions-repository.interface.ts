import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    
}