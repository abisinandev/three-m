import { ICancelSipUseCase } from "@application/use_cases/sip/interfaces/cancel-sip-usecase.interface";
import { IPauseSipUseCase } from "@application/use_cases/sip/interfaces/pause-sip-usecase.interface";
import { IResumeSipUseCase } from "@application/use_cases/sip/interfaces/resume-sip-usecase.interface";
import { ISipCreationUseCase } from "@application/use_cases/sip/interfaces/sip-creation-usecase.interface";
import { IUserSipDetailsUseCase } from "@application/use_cases/sip/interfaces/user-sip-details-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";

@injectable()
export class MutualFundSipController {
    constructor(
        @inject(SIP_TYPES.SipCreationUseCase) private readonly _sipCreationUseCase: ISipCreationUseCase,
        @inject(SIP_TYPES.UserSipDetailsUseCase) private readonly _sipDetailsUseCase: IUserSipDetailsUseCase,
        @inject(SIP_TYPES.PauseSipUseCase) private readonly _pauseSipUseCase: IPauseSipUseCase,
        @inject(SIP_TYPES.ResumeSipUseCase) private readonly _resumeSipUseCase: IResumeSipUseCase,
        @inject(SIP_TYPES.CancelSipUseCase) private readonly _cancelSipUseCase: ICancelSipUseCase,
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

    async pause(req: Request, res: Response, next: NextFunction) {
        try {
            const sipId = req.params?.sipId;
            const userId = req.user?.id;

            await this._pauseSipUseCase.execute(userId as string, sipId);
            return ResponseHelper.success(
                res,
                SuccessMessage.SIP_PAUSED,
                HttpStatus.OK,
            )

        } catch (error) {
            next(error)
        }
    }

    async resume(req: Request, res: Response, next: NextFunction) {
        try {
            const sipId = req.params?.sipId;
            const userId = req.user?.id;

            await this._resumeSipUseCase.execute(userId as string, sipId);
            return ResponseHelper.success(
                res,
                SuccessMessage.SIP_RESUME,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

    async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const sipId = req.params?.sipId;
            const userId = req.user?.id;

            await this._cancelSipUseCase.execute(userId as string, sipId);
            return ResponseHelper.success(
                res,
                SuccessMessage.SIP_CANCELLED,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }
}