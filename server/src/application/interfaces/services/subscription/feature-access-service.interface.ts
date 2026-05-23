import { Features } from "@domain/entities/subscription/enums/features.enum";
import { PlanEntity } from "@domain/entities/subscription/plan.entity";

export interface IFeatureAccessService {

    hasAccess(userId: string, feature: Features): Promise<boolean>;

    // ensureAccess(userId: string, feature: FREE_PLAN | PREMIUM_PLAN): Promise<void>;

    getUserPlan(userId: string): Promise<PlanEntity | null>;
}