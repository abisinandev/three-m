import { inject, injectable } from "inversify";
import { IDeleteExpenseUseCase } from "./interfaces/delete-expense-usecase.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { NotFoundError } from "@presentation/express/utils/error-handling";

@injectable()
export class DeleteExpenseUseCase implements IDeleteExpenseUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
    ) { }

    async execute(userId: string, expenseIndex: number): Promise<void> {
        const currentMonth = new Date().toISOString().slice(0, 7);

        const tracker = await this._expenseTrackerRepository.findOne({ userId, month: currentMonth });
        if (!tracker) throw new NotFoundError(ErrorMessages.DB.DATA_NOT_FOUND);

        tracker.removeExpenseAt(expenseIndex);
        await this._expenseTrackerRepository.update(tracker.id as string, tracker);
    }
}
