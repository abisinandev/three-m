import { ISipDetailsUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-details-usecase.interface";
import { ISipManagementUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-management-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminSipController {
    constructor(
        @inject(ADMIN_TYPES.SipManagementUseCase) private readonly _sipManagementUseCase: ISipManagementUseCase,
        @inject(FEATURE_TYPES.SipDetailsUseCase) private readonly _sipDetailsUseCase: ISipDetailsUseCase,

    ) { }

    async listAllSips(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._sipManagementUseCase.execute(req.query);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async fetchSipDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const sipId = req.params.sipId;
            const result = await this._sipDetailsUseCase.execute(
                sipId,
                req.query
            );

            console.log(result, '0000000000000000000');
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }
}