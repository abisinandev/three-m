import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { SubscriptionStatsDTO } from "@application/dto/admin/subscription/subscription-data.dto";
import { SubscriptionStatus } from "@domain/entities/subscription/enums/subscription-status.enums";
import { ISubscriptionStatsUseCase } from "./interfaces/subscription-stats-usecase.interface";

@injectable()
export class SubscriptionStatsUseCase implements ISubscriptionStatsUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepo: IPlanRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    ) { }  

    async execute(): Promise<SubscriptionStatsDTO> {

        const { totalCount: totalSubscriptions } = (await this._subscriptionRepo.count());
        
        const { totalCount: activeSubscriptionsCount } = await this._subscriptionRepo.count({
            status: SubscriptionStatus.ACTIVE,
            // endDate: { $gt: new Date() }
        });

        const totalRevenue = (await this._subscriptionRepo.totalRevenue()).totalRevenue;

        const allPlans = await this._planRepo.findAll() ?? [];
        const recentSubEntities = await this._subscriptionRepo.recentSubscribers() ?? [];

        const activeSubs = await this._subscriptionRepo.activeSubs();
        
        const subscriptionPlans = allPlans.map(plan => {
            const count = activeSubs.filter(s => s.planCode === plan.code).length;
            return {
                code: plan.code,
                count,
                percentage: activeSubscriptionsCount > 0 ? (count / activeSubscriptionsCount) * 100 : 0
            };
        });

        const recentSubscribers = await Promise.all(recentSubEntities.map(async (sub) => {
            const user = await this._userRepo.findById(sub.userId);

            const plan = allPlans.find(p => p.code === sub.planCode);
            return {
                fullName: user?.fullName || "Unknown",
                email: user?.email || "N/A",
                planCode: sub.planCode,
                amount: plan?.price || 0,
                createdAt: sub.createdAt
            };
        }));

        const monthlyGrowth = await this._subscriptionRepo.monthlyGrowth();

        return {
            totalRevenue,
            activeSubscriptions: activeSubscriptionsCount,
            totalSubscriptions,
            subscriptionPlans,
            recentSubscribers,
            monthlyGrowth
        };
    }
}
