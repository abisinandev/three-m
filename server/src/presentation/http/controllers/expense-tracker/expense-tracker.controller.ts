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
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ICreateNotificationUseCase } from "@application/use_cases/notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

@injectable()
export class ExpenseTrackerController {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerUseCase) private readonly _expenseTrackerUsecase: IExpenseTrackerUseCase,
        @inject(EXPENSE_TRACKER_TYPE.AddIncomeUseCase) private readonly _addIncomeUseCase: IAddIncomeUseCase,
        @inject(EXPENSE_TRACKER_TYPE.AddExpenseUseCase) private readonly _addExpenseUseCase: IAddExpenseUseCase,
        @inject(EXPENSE_TRACKER_TYPE.DeleteExpenseUseCase) private readonly _deleteExpenseUseCase: IDeleteExpenseUseCase,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotificationUseCase: ICreateNotificationUseCase,
    ) { }

    async fetchDatas(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req?.user?.id as string;

            const result = await this._expenseTrackerUsecase.execute(userId);
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
            await this._createNotificationUseCase.execute({
                message: "Expense added",
                title: "Add Expense",
                type: NotificationType.EXPENSE_TRACKER,
                userId,
            });
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
}