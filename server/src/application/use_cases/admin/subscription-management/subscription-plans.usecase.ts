import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PaginatedPlansDTO } from "@application/dto/admin/subscription/subscription-management.dto";
import { PlanMapper } from "@infrastructure/mappers/subscription/plan.mapper";
import { QueryOptions } from "mongoose";
import { ISubscriptionPlansUseCase } from "./interfaces/subscription-plans-usecase.interface";

@injectable()
export class SubscriptionPlansUseCase implements ISubscriptionPlansUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly planRepo: IPlanRepository,
    ) { }

    async execute(options: QueryOptions): Promise<PaginatedPlansDTO> {
        const plans = await this.planRepo.findWithFilters(options);
        const { totalCount } = await this.planRepo.count(options.filter);
        
        const page = options.page || 1;
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
