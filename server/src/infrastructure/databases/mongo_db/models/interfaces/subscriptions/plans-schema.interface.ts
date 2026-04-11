import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";

export interface IPlans {
    id?: string;
    code: SubscriptionStatus;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}