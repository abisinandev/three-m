import { IFetchTransactionsUseCase } from "@application/use_cases/admin/interfaces/fetch-transactions-usecase.interface";
import { ISipDetailsUseCase } from "@application/use_cases/admin/sip-management/interfaces/sip-details-usecase.interface";
import { IAdminVerifyTransactionUseCase } from "@application/use_cases/user/interfaces/admin-verify-transaction-usecase.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/types/admin/admin.types";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminTransactionsController {
    constructor(
        @inject(ADMIN_TYPES.FetchTransactionsUseCase) private readonly _fetchTransactions: IFetchTransactionsUseCase,
        @inject(ADMIN_TYPES.VerifyTransactionUseCase) private readonly _verifyTransaction: IAdminVerifyTransactionUseCase,
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

    async verifyTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const txId = req.params.txId;
            const result = await this._verifyTransaction.execute(txId);
            if (!result.isVerified) {
                return ResponseHelper.failure(
                    res,
                    ErrorMessage.TRANSACTION_FAILED,
                    HttpStatus.BAD_REQUEST
                )
            };

            return ResponseHelper.success(
                res,
                SuccessMessage.TRANSACTION_VERIFIED,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }



}