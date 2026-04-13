import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { PlanDTO } from "@application/dto/admin/subscription/subscription-management.dto";
import { PlanMapper } from "@infrastructure/mappers/subscription/plan.mapper";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";
import { IFetchPremiumPlanUseCase } from "./interfaces/fetch-premium-plan.usecase.interface";
import { NotFoundError} from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class FetchPremiumPlanUseCase implements IFetchPremiumPlanUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly planRepo: IPlanRepository,
    ) { }

    async execute(): Promise<PlanDTO> {
        const plan = await this.planRepo.findOne({ code: SubscriptionPlans.PREMIUM } as any);
        
        if (!plan) throw new NotFoundError(ErrorMessages.SUBSCRIPTION.PLAN_UNAVAILABLE)

        return PlanMapper.toDTO(plan);
    }
}
