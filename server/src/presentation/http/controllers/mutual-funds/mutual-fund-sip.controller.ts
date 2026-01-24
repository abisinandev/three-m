import { ISipCreationUseCase } from "@application/use_cases/sip/interfaces/sip-creation-usecase.interface";
import { IUserSipDetailsUseCase } from "@application/use_cases/sip/interfaces/user-sip-details-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class MutualFundSipController {
    constructor(
        @inject(FEATURE_TYPES.SipCreationUseCase) private readonly _sipCreationUseCase: ISipCreationUseCase,
        @inject(FEATURE_TYPES.UserSipDetailsUseCase) private readonly _sipDetailsUseCase: IUserSipDetailsUseCase,
    ) { }

    async createSip(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body };
            const userId = req?.user?.id
            await this._sipCreationUseCase.execute(dto, userId as string);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async listSips(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._sipDetailsUseCase.execute(req.query, userId as string);
            console.log("result: ", result);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error)
        }
    }
}