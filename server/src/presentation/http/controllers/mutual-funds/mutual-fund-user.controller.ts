import { IOneTimeInvestmentUseCase } from "@application/use_cases/mutual-fund/interfaces/one-time-investment.usecase.interface";
import { IListFundsUserSideUseCase } from "@application/use_cases/mutual-fund/interfaces/list-fund-usecase.interface";
import { IMfInvestmentHistoryUseCase } from "@application/use_cases/mutual-fund/interfaces/mf-investment-history-usecase.interface";
import { IMutualFundDetailsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-details-usecase.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class MutualFundUserController {
    constructor(
        @inject(MUTUAL_FUND_TYPES.ListFundUserSideUseCase) private readonly _listFundUseCase: IListFundsUserSideUseCase,
        @inject(MUTUAL_FUND_TYPES.MutualFundDetailsUseCase) private readonly _mfDetailsUsecase: IMutualFundDetailsUseCase,
        @inject(MUTUAL_FUND_TYPES.InvestmentUseCase) private readonly _investmentUseCase: IOneTimeInvestmentUseCase,
        @inject(MUTUAL_FUND_TYPES.MfInvestmentHistoryUseCase) private readonly _mfInvestmentsHistory: IMfInvestmentHistoryUseCase,
    ) { }

    async fetchFunds(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                page,
                limit,
                search,
                category,
                sortBy,
                sortOrder,
            } = req.query;

            const userId = req?.user?.id;
            const result = await this._listFundUseCase.execute(
                userId as string, {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                search: typeof search === "string" ? search : "",
                categories:
                    typeof category === "string"
                        ? category.split(",")
                        : undefined,
                sortBy: typeof sortBy === "string" ? sortBy : undefined,
                sortOrder: sortOrder === "asc" ? "asc" : "desc",
            });

            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error);
        }
    }

    async fetchFundDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { interval } = req.query;
            const schemeCode = req.params.schemeCode;
            const result = await this._mfDetailsUsecase.execute(schemeCode as string, interval as NavInterval);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async investment(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = { ...req.body };
            const userId = req.user?.id;
            const idempotencyKey = req.headers['x-idempotency-key'] as string;
            await this._investmentUseCase.execute(dto, userId as string, idempotencyKey);

            return ResponseHelper.success(
                res,
                SuccessMessages.PAYMENT.INVESTMENT_SUCCESS,
                null,
                HttpStatus.CREATED
            )
        } catch (error) {
            next(error)
        }
    }

    async listInvestments(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const result = await this._mfInvestmentsHistory.execute(userId as string);
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
}