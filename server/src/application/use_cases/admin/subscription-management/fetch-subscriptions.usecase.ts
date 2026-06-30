import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { ISubscriptionRepository } from "@application/interfaces/repositories/subscriptions/subscriptions-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { PaginatedSubscriptionsDTO, UserSubscriptionDTO } from "@application/dto/admin/subscription/subscription-data.dto";
import { QueryOptions } from "mongoose";
import { IFetchSubscriptionsUseCase } from "./interfaces/fetch-subscriptions-usecase.interface";

@injectable()
export class FetchSubscriptionsUseCase implements IFetchSubscriptionsUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    ) { }

    async execute(options: QueryOptions): Promise<PaginatedSubscriptionsDTO> {
        const subscriptions = await this._subscriptionRepo.findWithFilters(options);
        const { totalCount } = await this._subscriptionRepo.count(options.filter);

        const subscriptionDTOs: UserSubscriptionDTO[] = await Promise.all(
            subscriptions.map(async (sub) => {
                const user = await this._userRepo.findById(sub.userId);
                return {
                    fullName: user?.fullName || "Unknown",
                    email: user?.email || "N/A",
                    planCode: sub.planCode,
                    startDate: sub.startDate,
                    endDate: sub.endDate,
                    status: sub.status,
                    createdAt: sub.createdAt
                };
            })  
        );

        const page = options.page || 1;
        const limit = options.limit || 10;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            subscriptions: subscriptionDTOs,
            totalCount,
            page,
            limit,
            totalPages
        };
    }
}
