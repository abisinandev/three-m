import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

export interface PlanDTO {
    id: string;
    code: SubscriptionPlans;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export interface PaginatedPlansDTO {
    plans: PlanDTO[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}
