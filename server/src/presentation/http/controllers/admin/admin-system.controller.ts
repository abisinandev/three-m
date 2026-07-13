import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { NextFunction, Request, Response } from "express";
import { IGetSystemJobLogDetailUseCase } from "@application/use_cases/admin/system-logs/interfaces/get-system-job-log-detail.interface";
import { IGetSystemJobLogsUseCase } from "@application/use_cases/admin/system-logs/interfaces/get-system-job-logs.interface";

@injectable()
export class AdminSystemController {
    constructor(
        @inject(ADMIN_TYPES.GetSystemJobLogsUseCase) private readonly _getLogs: IGetSystemJobLogsUseCase,
        @inject(ADMIN_TYPES.GetSystemJobLogDetailUseCase) private readonly _getLogDetail: IGetSystemJobLogDetailUseCase
    ) {}

    async getJobLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobName, status, page, limit } = req.query;
            const result = await this._getLogs.execute({
                jobName: jobName as string,
                status: status as string,
                page: Number(page) || 1,
                limit: Number(limit) || 20
            });
            return ResponseHelper.success(res, SuccessMessages.DATA.FETCHED, result, HttpStatus.OK);
        } catch (error) {
            next(error);
        }
    }

    async getJobLogDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this._getLogDetail.execute(id as string);
            return ResponseHelper.success(res, SuccessMessages.DATA.FETCHED, result, HttpStatus.OK);
        } catch (error) {
            next(error);
        }
    }
}
