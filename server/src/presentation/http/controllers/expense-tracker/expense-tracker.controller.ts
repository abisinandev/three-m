import { IAddIncomeUseCase } from "@application/use_cases/expense-tracker/interfaces/add-income-usecase.interface";
import { IAddExpenseUseCase } from "@application/use_cases/expense-tracker/interfaces/add-expenses-usecase.interface";
import { IExpenseTrackerUseCase } from "@application/use_cases/expense-tracker/interfaces/expense-tracker-usecase.interface";
import { SuccessMessage } from "@domain/enum/express/messages/success.message";
import { HttpStatus } from "@domain/enum/express/status-code";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IDeleteExpenseUseCase } from "@application/use_cases/expense-tracker/interfaces/delete-expense-usecase.interface";
import { IAnalyticsUseCase } from "@application/use_cases/expense-tracker/interfaces/analytics-usecase.interface";

@injectable()
export class ExpenseTrackerController {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerUseCase) private readonly _expenseTrackerUsecase: IExpenseTrackerUseCase,
        @inject(EXPENSE_TRACKER_TYPE.AddIncomeUseCase) private readonly _addIncomeUseCase: IAddIncomeUseCase,
        @inject(EXPENSE_TRACKER_TYPE.AddExpenseUseCase) private readonly _addExpenseUseCase: IAddExpenseUseCase,
        @inject(EXPENSE_TRACKER_TYPE.DeleteExpenseUseCase) private readonly _deleteExpenseUseCase: IDeleteExpenseUseCase,
        @inject(EXPENSE_TRACKER_TYPE.AnalyticsUseCase) private readonly _analyticsUseCase: IAnalyticsUseCase,
    ) { }

    async fetchDatas(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;
            const month = req.query.month as string;

            const result = await this._expenseTrackerUsecase.execute(userId, month);
            return ResponseHelper.success( 
                res,
                SuccessMessage.DATA_FETCHED,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async addIncome(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;
            const dto = { ...req.body }

            const result = await this._addIncomeUseCase.execute(dto, userId);

            return ResponseHelper.success(
                res,
                SuccessMessage.OPERATION_SUCCESSFUL,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async addExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;
            const dto = { ...req.body }

            const result = await this._addExpenseUseCase.execute(dto, userId);
            return ResponseHelper.success(
                res,
                SuccessMessage.OPERATION_SUCCESSFUL,
                result,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async deleteExpense(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;
            const { index } = req.params;

            await this._deleteExpenseUseCase.execute(userId, parseInt(index));
            return ResponseHelper.success(
                res,
                SuccessMessage.OPERATION_SUCCESSFUL,
                null,
                HttpStatus.OK
            )
        } catch (error) {
            next(error)
        }
    }

    async fetchAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;
            const month = req.query.month as string;
            const result = await this._analyticsUseCase.execute(userId, month);
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