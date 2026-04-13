import { SubscriptionEntity } from "@domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "../base-repository.interface";
import { FilterQuery, QueryOptions } from "mongoose";
import { SubscriptionStatsDTO } from "@application/dto/admin/subscription/subscription-data.dto";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    findWithFilters(options: QueryOptions): Promise<SubscriptionEntity[]>;
    count(filter?: FilterQuery<unknown>): Promise<{ totalCount: number }>;
    totalRevenue(): Promise<{ totalRevenue: number }>;
    recentSubscribers(): Promise<SubscriptionEntity[] | null>;
    activeSubs(): Promise<SubscriptionEntity[]>;
    monthlyGrowth(): Promise<{ month: string, revenue: number, subscriptions: number }[]>;
    findByUserId(userId: string): Promise<SubscriptionEntity | null>
}