import { IChangeFundStatusUseCase } from "@application/use_cases/mutual-fund/interfaces/change-fund-status-usecase.interface";
import { IFetchAllFundsUseCases } from "@application/use_cases/mutual-fund/interfaces/fetch-all-funds-usecase.interface";
import { IMfCagrUseCase } from "@application/use_cases/mutual-fund/interfaces/mf-cagr-usecse.interface";
import { IMutualFundNavUpdatesUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-usecase.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class MutualFundsAdminController {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundUsecase) private readonly _mutualFundsUseCase: IMutualFundsUseCase,
        @inject(MUTUAL_FUND_TYPES.FetchAllFundUseCases) private readonly _fetchAllFundsUseCase: IFetchAllFundsUseCases,
        @inject(MUTUAL_FUND_TYPES.ChangeStatusUseCase) private readonly _changeFundStatus: IChangeFundStatusUseCase,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavUpdateUseCase) private readonly _mutualFundNavUpdate: IMutualFundNavUpdatesUseCase,
        @inject(MUTUAL_FUND_TYPES.MfCagrUseCase) private readonly _mfCagrUpdateUseCase: IMfCagrUseCase,
    ) { }

    async addFunds(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body }
            await this._mutualFundsUseCase.execute(dto);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.OPERATION_SUCCESSFUL,
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
                SuccessMessages.DATA.FETCHED,
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
            await this._mutualFundNavUpdate.execute(NavInterval.WEEKLY);
            await this._mutualFundNavUpdate.execute(NavInterval.MONTHLY);
            await this._mutualFundNavUpdate.execute(NavInterval.YEARLY);
            await this._mfCagrUpdateUseCase.execute();

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.UPDATED,
                HttpStatus.OK,
            )
        } catch (error) {
            next(error)
        }
    }

}  