import { IFetchTransactionsUseCase } from "@application/use_cases/admin/interfaces/fetch-transactions-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminTransactionsController {
    constructor(
        @inject(ADMIN_TYPES.FetchTransactionsUseCase) private readonly _fetchTransactions: IFetchTransactionsUseCase,
    ) { };

    async getTransactions(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._fetchTransactions.execute(req.query);
            return ResponseHelper.success(
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }

}