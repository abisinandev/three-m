import { IConfirmRedeemUseCase } from "@application/use_cases/portfolio/interfaces/confirm-redeem-usecase.interface";
import { IPortfolioDetailsUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-details-usecase.interface";
import { IRadeemInvestmentUseCase } from "@application/use_cases/portfolio/interfaces/redeem-investments-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class PortFolioController {
    constructor(
        @inject(FEATURE_TYPES.PortfolioDetailsUseCase) private readonly _listAllInvestments: IPortfolioDetailsUseCase,
        @inject(FEATURE_TYPES.RadeemInvestmentUseCase) private readonly _radeemInvestments: IRadeemInvestmentUseCase,
        @inject(FEATURE_TYPES.ConfirmRedeemUseCase) private readonly _confirmRedeem: IConfirmRedeemUseCase
    ) { }

    async listAllInvestments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id

            const result = await this._listAllInvestments.execute(userId as string, req.query);
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

    async redeemInvestments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id;
            const result = await this._radeemInvestments.execute(userId as string);
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

    async confirmRedeem(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body }
            const userId = req?.user?.id;
            const result = await this._confirmRedeem.execute({ ...dto, userId });
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
}  