import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

export interface SubscriptionStatsDTO {
    totalRevenue: number;
    activeSubscriptions: number;
    totalSubscriptions: number;
    subscriptionPlans: {
        code: string;
        count: number;
        percentage: number;
    }[];
    recentSubscribers: {
        userName: string;
        userEmail: string;
        planCode: string;
        amount: number;
        createdAt: Date;
    }[];
}

export interface UserSubscriptionDTO {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    planCode: SubscriptionPlans;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    createdAt: Date;
}

export interface PaginatedSubscriptionsDTO {
    subscriptions: UserSubscriptionDTO[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}
