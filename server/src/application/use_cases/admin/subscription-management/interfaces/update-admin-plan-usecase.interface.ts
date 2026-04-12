import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

export interface UpdatePlanRequest {
    code: SubscriptionPlans;
    price?: number;
    durationInDays?: number;
    features?: string[];
    isActive?: boolean;
}

export interface IUpdateAdminPlanUseCase {
    execute(request: UpdatePlanRequest): Promise<void>;
}
