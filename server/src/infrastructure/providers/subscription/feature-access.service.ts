import { inject, injectable } from "inversify";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { PlanEntity } from "@domain/entities/subscription/plan.entity";

@injectable()
export class FeatureAccessService implements IFeatureAccessService {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepo: IPlanRepository
    ) { }

    private async resolveUserPlan(userId: string): Promise<PlanEntity | null> {
        const subscription = await this._subscriptionRepo.findByUserId(userId);

        if (subscription && subscription.isActive()) {
            return this._planRepo.findByCode(SubscriptionPlans.PREMIUM);
        } else {

            return this._planRepo.findByCode(SubscriptionPlans.FREE);
        }

    }

    async hasAccess(userId: string, feature: Features): Promise<boolean> {
        const plan = await this.resolveUserPlan(userId);

        if (!plan) return false;

        return plan.hasFeature(feature);
    }

    async getUserPlan(userId: string): Promise<PlanEntity | null> {
        return this.resolveUserPlan(userId);
    }
    
}