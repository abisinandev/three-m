import { inject, injectable } from "inversify";
import { ISubscriptionManagementUseCase } from "./interfaces/subscription-management-usecase.interface";
import { FilterQuery, QueryOptions } from "mongoose";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PaginatedPlansDTO } from "@application/dto/admin/subscription/subscription-management.dto";
import { PlanMapper } from "@infrastructure/mappers/subscription/plan.mapper";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { PlanModel } from "@infrastructure/databases/mongo_db/models/schemas/subscriptions/plans-schema";

@injectable()
export class SubscriptionManagementUseCase implements ISubscriptionManagementUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly planRepo: IPlanRepository,
        @inject(USER_TYPES.UserRepository) private readonly userRepo: IUserRepository,
    ) { }

    async execute(filter: FilterQuery<unknown>, options: QueryOptions): Promise<PaginatedPlansDTO> {
        const plans = await this.planRepo.findPlans() ?? [];
        const totalCount = await PlanModel.countDocuments(filter);

        const page = options.skip && options.limit ? Math.floor(options.skip / options.limit) + 1 : 1;
        const limit = options.limit || 10;
        const totalPages = Math.ceil(totalCount / limit);

        return {
            plans: plans.map(plan => PlanMapper.toDTO(plan)),
            totalCount,
            page,
            limit,
            totalPages
        };
    }

}