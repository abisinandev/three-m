import { inject, injectable } from "inversify";
import { IAddIncomeUseCase } from "./interfaces/add-income-usecase.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { AddIncomeDTO } from "@application/dto/expense-tracker/add-income.dto";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { Income } from "@domain/entities/expense-tracker/value-objects/income.vo";
import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { IncomeSource } from "@domain/entities/expense-tracker/types/expense-tracker.types";

@injectable()
export class AddIncomeUseCase implements IAddIncomeUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    ) { }

    async execute(data: AddIncomeDTO, userId: string): Promise<void> {
        const user = await this._userRepository.findById(userId as string);
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        const currentMonth = new Date().toISOString().slice(0, 7)

        const tracker = await this._expenseTrackerRepository.findOne({
            userId,
            month: currentMonth
        });

        const newIncome = new Income(data.amount, data.source as IncomeSource);

        if (tracker) {
            tracker.addIncomeSource(newIncome);
            await this._expenseTrackerRepository.update(tracker.id as string, tracker);
        } else {
            const newTracker = ExpenseTrackerEntity.create({
                userId,
                month: currentMonth,
                income: newIncome,
            });
            await this._expenseTrackerRepository.create(newTracker);
        }
    }
}