import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { IFetchPremiumPlanUseCase } from "@application/use_cases/user/subscription/interfaces/fetch-premium-plan.usecase.interface";

@injectable()
export class UserSubscriptionController {
    constructor(
        @inject(SUBSCRIPTION_TYPES.FetchPremiumPlanUseCase) private readonly fetchPremiumPlanUseCase: IFetchPremiumPlanUseCase,
    ) { }

    async getPremiumPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.fetchPremiumPlanUseCase.execute();

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}
