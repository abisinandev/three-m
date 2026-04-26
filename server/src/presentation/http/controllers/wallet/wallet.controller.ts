import { IUserWalletUseCase } from "@application/use_cases/user/wallet/interfaces/user-wallet-usecase.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WalletController {
    constructor(
        @inject(USER_TYPES.UserWalletUseCase) private readonly _walletUseCase: IUserWalletUseCase,
    ) { }

    async getWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            const result = await this._walletUseCase.execute(userId as string, req.query);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK,
            );
        } catch (error) {
            next(error)
        }
    }


}