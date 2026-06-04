import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "../base-repository.interface";
import { FilterQuery, QueryOptions } from "mongoose";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    findWithFilters(options: QueryOptions): Promise<SubscriptionEntity[]>;
    count(filter?: FilterQuery<unknown>): Promise<{ totalCount: number }>;
    totalRevenue(): Promise<{ totalRevenue: number }>;
    recentSubscribers(): Promise<SubscriptionEntity[] | null>;
    activeSubs(): Promise<SubscriptionEntity[]>;
    monthlyGrowth(): Promise<{ month: string, revenue: number, subscriptions: number }[]>;
    findByUserId(userId: string): Promise<SubscriptionEntity | null>;
    getTotalMRR(): Promise<number>;
    updateStatus(subscriptionId: string, status: SubscriptionStatus): Promise<void>;
}