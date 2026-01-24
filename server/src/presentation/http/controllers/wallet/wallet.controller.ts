import { IMutualFundsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-usecase.interface";
import { IUserWalletUseCase } from "@application/use_cases/user/interfaces/user-wallet-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WalletController {
    constructor(
        @inject(USER_TYPES.UserWalletUseCase) private readonly _walletUseCase: IUserWalletUseCase,
        @inject(FEATURE_TYPES.MutualFundUsecase) private readonly _mutualFundsUseCase: IMutualFundsUseCase,

    ) { }

    async getWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const result = await this._walletUseCase.execute(userId as string, req.query);
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