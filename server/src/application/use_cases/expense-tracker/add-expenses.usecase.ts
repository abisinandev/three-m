import { inject, injectable } from "inversify";
import { IAddExpenseUseCase } from "./interfaces/add-expenses-usecase.interface";
import { AddExpenseDTO } from "@application/dto/expense-tracker/add-expense.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";
import { Income } from "@domain/entities/expense-tracker/value-objects/income.vo";
import { IncomeSource } from "@domain/entities/expense-tracker/types/expense-tracker.types";
import { ErrorMessages } from "@shared/constants/error.messages";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ICreateNotificationUseCase } from "@application/use_cases/notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import mongoose from "mongoose";

@injectable()
export class AddExpensesUseCase implements IAddExpenseUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotificationUseCase: ICreateNotificationUseCase,
    ) { }

    async execute(dto: AddExpenseDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession();

        await session.withTransaction(async () => {

            const user = await this._userRepository.findById(userId, session);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const currentMonth = new Date().toISOString().slice(0, 7);

            let tracker = await this._expenseTrackerRepository.findOne(
                { userId, month: currentMonth },
                session
            );
            if (!tracker) throw new ValidationError(ErrorMessages.EXPENSE_TRACKER.ADD_INCOME);

            const totalIncome = tracker.incomes.reduce((acc, inc) => acc + inc.amount, 0);
            if (dto.amount > totalIncome) {
                throw new ValidationError(ErrorMessages.EXPENSE_TRACKER.INSUFFICIENT_BALANCE);
            }

            const updatedSpent =
                tracker.expenseSummary.totalNeedsSpent +
                tracker.expenseSummary.totalWantsSpent;

            const income = tracker.totalIncome;
            const remainingBudget = income - updatedSpent;

            if (income > 0) {
                const usedPercentage = (updatedSpent / income) * 100;

                if (usedPercentage >= 100) {
                    await this._createNotificationUseCase.execute({
                        userId,
                        title: "Budget Exceeded",
                        message: `You exceeded your monthly budget by ₹${Math.abs(remainingBudget)}.`,
                        type: NotificationType.WARNING,
                    });
                } else if (usedPercentage >= 80) {
                    await this._createNotificationUseCase.execute({
                        userId,
                        title: "Budget Alert",
                        message: "You have used 80% of your monthly budget.",
                        type: NotificationType.INFO,
                    });
                }
            }

            const newExpense = new Expense({
                amount: dto.amount,
                category: dto.category,
                type: dto.type,
                description: dto.description,
                date: dto.date ? new Date(dto.date) : new Date(),
                paymentMode: dto.paymentMode
            });

            if (tracker) {
                tracker.addExpense(newExpense);
                await this._expenseTrackerRepository.update(
                    tracker.id as string,
                    tracker,
                    session
                );
            } else {
                const emptyIncome = new Income(0, 'OTHER' as IncomeSource);
                tracker = ExpenseTrackerEntity.create({
                    userId,
                    month: currentMonth,
                    income: emptyIncome,
                    expenses: [newExpense]
                });

                await this._expenseTrackerRepository.create(tracker, session);
            }

        });

        session.endSession();
    }
}