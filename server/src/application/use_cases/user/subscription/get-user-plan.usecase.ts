import { inject, injectable } from "inversify";
import { IGetUserPlanUseCase } from "./interfaces/get-user-plan.usecase.interface";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { PlanEntity } from "@domain/entities/subscription/plan.entity";

@injectable()
export class GetUserPlanUseCase implements IGetUserPlanUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepo: IPlanRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    ) { }

    async execute(userId: string, planCode?: string): Promise<PlanEntity | null> {
        const subscription = await this._subscriptionRepo.findByUserId(userId); 
        
        if (subscription) {
            if (subscription.isActive()) {
                const subscriptionCode = planCode || subscription.planCode;
                return this._planRepo.findByCode(subscriptionCode);
            }

            if (subscription.endDate.getTime() < Date.now() && subscription.status !== SubscriptionStatus.INACTIVE) {
                await Promise.all([
                    this._subscriptionRepo.updateStatus(subscription.id as string, SubscriptionStatus.INACTIVE),
                    this._userRepo.updateSubscriptionData(userId, {
                        subscriptionStatus: SubscriptionStatus.INACTIVE,
                        subscriptionPlan: SubscriptionPlans.FREE,
                        subscriptionId: null,
                    }),
                ]);
            }
        }

        return await this._planRepo.findByCode(SubscriptionPlans.FREE);
    }
}
