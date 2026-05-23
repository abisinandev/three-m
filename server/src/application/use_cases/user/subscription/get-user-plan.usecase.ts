import { inject, injectable } from "inversify";
import { IGetUserPlanUseCase } from "./interfaces/get-user-plan.usecase.interface";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { PlanEntity } from "@domain/entities/subscription/plan.entity";

@injectable()
export class GetUserPlanUseCase implements IGetUserPlanUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepo: IPlanRepository
    ) { }

    async execute(userId: string, planCode?: string): Promise<PlanEntity | null> {
        const subscription = await this._subscriptionRepo.findByUserId(userId);

        if (subscription?.isActive()) {
            const codeToFetch = planCode || subscription.planCode;
            return this._planRepo.findByCode(codeToFetch);
        }

        return this._planRepo.findByCode(SubscriptionPlans.FREE);

    }
}
