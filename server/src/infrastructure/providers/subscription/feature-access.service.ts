import { inject, injectable } from "inversify";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { PlanEntity } from "@domain/entities/subscription/plan.entity";
import { IGetUserPlanUseCase } from "@application/use_cases/user/subscription/interfaces/get-user-plan.usecase.interface";

@injectable()
export class FeatureAccessService implements IFeatureAccessService {
    constructor(
        @inject(SUBSCRIPTION_TYPES.GetUserPlanUseCase) private readonly _getUserPlanUseCase: IGetUserPlanUseCase
    ) { }

    async hasAccess(userId: string, feature: Features): Promise<boolean> {
        const plan = await this._getUserPlanUseCase.execute(userId);

        if (!plan) return false;

        return plan.hasFeature(feature);
    }

    async getUserPlan(userId: string): Promise<PlanEntity | null> {
        return this._getUserPlanUseCase.execute(userId);
    }

}