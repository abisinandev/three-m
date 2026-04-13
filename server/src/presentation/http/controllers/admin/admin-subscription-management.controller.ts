import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { QueryOptions } from "mongoose";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { IFetchSubscriptionsUseCase } from "@application/use_cases/admin/subscription-management/interfaces/fetch-subscriptions-usecase.interface";
import { ISubscriptionPlansUseCase } from "@application/use_cases/admin/subscription-management/interfaces/subscription-plans-usecase.interface";
import { ISubscriptionStatsUseCase } from "@application/use_cases/admin/subscription-management/interfaces/subscription-stats-usecase.interface";
import { IUpdateAdminPlanUseCase } from "@application/use_cases/admin/subscription-management/interfaces/update-admin-plan-usecase.interface";
import { SubscriptionPlans } from "@domain/entities/subscription/enums/plans.enum";

@injectable()
export class AdminSubscriptionManagementController {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionPlansUseCase) private readonly getPlansUseCase: ISubscriptionPlansUseCase,
        @inject(SUBSCRIPTION_TYPES.UpdateAdminPlanUseCase) private readonly updatePlanUseCase: IUpdateAdminPlanUseCase,
        @inject(SUBSCRIPTION_TYPES.FetchSubscriptionsUseCase) private readonly getSubscriptionsUseCase: IFetchSubscriptionsUseCase,
        @inject(SUBSCRIPTION_TYPES.SubscriptionStatsUseCase) private readonly getStatsUseCase: ISubscriptionStatsUseCase,
    ) { }

    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 10, search = "", isActive } = req.query;

            const filter: Record<string, unknown> = {};
            if (isActive !== undefined) {
                filter.isActive = isActive === "true";
            }

            const options: QueryOptions = {
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                filter
            };

            const result = await this.getPlansUseCase.execute(options);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async getSubscriptions(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 10, search = "", status } = req.query;

            const filter: Record<string, unknown> = {};
            if (status) {
                filter.status = status;
            }

            const options: QueryOptions = {
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                filter
            };

            const result = await this.getSubscriptionsUseCase.execute(options);

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.getStatsUseCase.execute();

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async updatePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.params;
            const { price, durationInDays, features, isActive } = req.body;

            await this.updatePlanUseCase.execute({
                code: code as SubscriptionPlans,
                price,
                durationInDays,
                features,
                isActive
            });

            return ResponseHelper.success(
                res,
                SuccessMessages.SUBSCRIPTION.PLAN_UPDATED,
                null,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }
}