import type { IDashboardUseCase } from "@application/use_cases/dashboard/interface/dashboard-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { DASHBOARD_TYPES } from "@infrastructure/inversify_di/features/dashboard/dashboard.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class DashboardController {
    constructor(
        @inject(DASHBOARD_TYPES.DashboardUseCase) private readonly _dashboardUseCase: IDashboardUseCase,
    ) { }

    async getDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;

            const result = await this._dashboardUseCase.execute(userId);

            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error);
        }
    }
}
