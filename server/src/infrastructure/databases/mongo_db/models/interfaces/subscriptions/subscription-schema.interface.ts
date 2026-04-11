import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";

export interface ISubscription {
    id?: string;
    userId: string;
    plans: SubscriptionPlans;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
    createdAt: Date;
    updatedAt?: Date;
}