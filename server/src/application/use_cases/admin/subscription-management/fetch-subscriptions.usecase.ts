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
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly subscriptionRepo: ISubscriptionRepository,
        @inject(USER_TYPES.UserRepository) private readonly userRepo: IUserRepository,
    ) { }

    async execute(options: QueryOptions): Promise<PaginatedSubscriptionsDTO> {
        const subscriptions = await this.subscriptionRepo.findWithFilters(options);
        const { totalCount } = await this.subscriptionRepo.count(options.filter);

        const subscriptionDTOs: UserSubscriptionDTO[] = await Promise.all(
            subscriptions.map(async (sub) => {
                const user = await this.userRepo.findById(sub.userId);
                return {
                    id: sub.id as string,
                    userId: sub.userId,
                    userName: user?.fullName || "Unknown",
                    userEmail: user?.email || "N/A",
                    planCode: sub.plans,
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
