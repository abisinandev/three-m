import { IChangeFundStatusUseCase } from "@application/use_cases/interfaces/features/mutual-funds/change-fund-status-usecase.interface";
import { IFetchAllFundsUseCases } from "@application/use_cases/interfaces/features/mutual-funds/fetch-all-funds-usecase.interface";
import { IMutualFundNavUpdatesUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundsUseCase } from "@application/use_cases/interfaces/features/mutual-funds/mutual-fund-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class MutualFundsAdminController {
    constructor(
        @inject(FEATURE_TYPES.MutualFundUsecase) private readonly _mutualFundsUseCase: IMutualFundsUseCase,
        @inject(FEATURE_TYPES.FetchAllFundUseCases) private readonly _fetchAllFundsUseCase: IFetchAllFundsUseCases,
        @inject(FEATURE_TYPES.ChangeStatusUseCase) private readonly _changeFundStatus: IChangeFundStatusUseCase,
        @inject(FEATURE_TYPES.MutualFundNavUpdateUseCase) private readonly _mutualFundNavUpdate: IMutualFundNavUpdatesUseCase,
    ) { }

    async addFunds(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body }
            await this._mutualFundsUseCase.execute(dto);
            return ResponseHelper.success(
                res,
                "Successfully done",
                HttpStatus.OK,
            )
        } catch (error) {
            next(error);
        }
    };

    async fetchAllFunds(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._fetchAllFundsUseCase.execute(req.query);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const fundId = req.params.fundId
            await this._changeFundStatus.execute(fundId);
            await this._mutualFundNavUpdate.execute(NavInterval.DAILY);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_UPDATED,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

}