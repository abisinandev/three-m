import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IPlanRepository } from "@application/interfaces/repositories/subscriptions/plan-repository.interface";
import { IUpdateAdminPlanUseCase, UpdatePlanRequest } from "./interfaces/update-admin-plan-usecase.interface";
import { ValidationError } from "@presentation/express/utils/error-handling";

@injectable()
export class UpdateAdminPlanUseCase implements IUpdateAdminPlanUseCase {
    constructor(
        @inject(SUBSCRIPTION_TYPES.PlanRepository) private readonly _planRepo: IPlanRepository,
    ) { }

    async execute(request: UpdatePlanRequest): Promise<void> {
        const plan = await this._planRepo.findOne({ code: request.code });
        if (!plan) {
            throw new ValidationError(`Plan with code ${request.code} not found.`);
        }

        plan.update({
            price: request.price,
            durationInDays: request.durationInDays,
            features: request.features,
            isActive: request.isActive
        });

        await this._planRepo.update(plan.id!, plan);
    }
}
