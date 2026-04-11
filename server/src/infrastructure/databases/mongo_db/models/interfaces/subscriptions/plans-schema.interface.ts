import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

export interface IPlans {
    id?: string;
    code: SubscriptionPlans;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
