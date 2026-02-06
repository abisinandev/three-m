import { inject, injectable } from "inversify";
import { IAddExpenseUseCase } from "./interfaces/add-expenses-usecase.interface";
import { AddExpenseDTO } from "@application/dto/expense-tracker/add-expense.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { ValidationError, NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";
import { Income } from "@domain/entities/expense-tracker/value-objects/income.vo";
import { IncomeSource } from "@domain/entities/expense-tracker/types/expense-tracker.types";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class AddExpensesUseCase implements IAddExpenseUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(dto: AddExpenseDTO, userId: string): Promise<void> {
        const user = await this._userRepository.findById(userId as string);
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        const currentMonth = new Date().toISOString().slice(0, 7);
        let tracker = await this._expenseTrackerRepository.findOne({
            userId,
            month: currentMonth
        });

        const totalInvestments = await this._investmentRepository.findByUsertotalInvestments(userId);

        const currentSpent = tracker ? (tracker.expenseSummary.totalNeedsSpent + tracker.expenseSummary.totalWantsSpent) : 0;
        const currentIncome = tracker ? tracker.totalIncome : 0;
        const availableBalance = currentIncome - currentSpent - (totalInvestments || 0);

        if (availableBalance < dto.amount) {
            throw new ValidationError(ErrorMessages.EXPENSE_TRACKER.INSUFFICIENT_BALANCE);
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
            await this._expenseTrackerRepository.update(tracker.id as string, tracker);
        } else {
            const emptyIncome = new Income(0, 'OTHER' as IncomeSource);
            tracker = ExpenseTrackerEntity.create({
                userId,
                month: currentMonth,
                income: emptyIncome,
                expenses: [newExpense]
            });
            await this._expenseTrackerRepository.create(tracker);
        }
    }
}