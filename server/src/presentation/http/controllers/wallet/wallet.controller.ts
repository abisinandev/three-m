import { IUserWalletUseCase } from "@application/use_cases/interfaces/user/user-wallet-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
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
            const result = await this._walletUseCase.execute(userId as string);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: SuccessMessage.DATA_FETCHED,
                data: result
            });
        } catch (error) {
            next(error)
        }
    }
}