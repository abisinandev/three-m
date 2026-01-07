import { IListFundsUserSideUseCase } from "@application/use_cases/interfaces/features/mutual-funds/list-fund-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class MutualFundUserController {
    constructor(
        @inject(FEATURE_TYPES.ListFundUserSideUseCase) private readonly _listFundUseCase: IListFundsUserSideUseCase,
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

            const result = await this._listFundUseCase.execute({
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
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error);
        }
    }
}