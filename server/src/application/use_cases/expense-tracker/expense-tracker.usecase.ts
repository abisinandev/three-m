import { IExpenseTrackerUseCase } from "./interfaces/expense-tracker-usecase.interface";
import { inject, injectable } from "inversify";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { ExpenseTrackerDTO } from "@application/dto/expense-tracker/expense-tracker-response.dto";

@injectable()
export class ExpenseTrackerUseCase implements IExpenseTrackerUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
    ) { }

    async execute(userId: string, month?: string): Promise<ExpenseTrackerDTO> {
        const currentMonth = month || new Date().toISOString().slice(0, 7);

        const tracker = await this._expenseTrackerRepository.findOne({ userId, month: currentMonth });

        const expenses = tracker ? tracker.expenses.map(exp => ({
            amount: exp.amount,
            category: exp.category,
            type: exp.type,
            description: exp.description,
            date: exp.date,
            paymentMode: exp.paymentMode
        })) : [];

        const incomeSources = tracker ? tracker.incomes.map(inc => ({
            source: inc.source,
            amount: inc.amount,
        })) : [];

        const totalIncome = tracker ? tracker.totalIncome : 0;
        const needsTarget = totalIncome * 0.50;
        const wantsTarget = totalIncome * 0.30;
        const savingsTarget = totalIncome * 0.20;

        const totalNeeds = tracker ? tracker.expenseSummary.totalNeedsSpent : 0;
        const totalWants = tracker ? tracker.expenseSummary.totalWantsSpent : 0;
        const totalSavings = tracker ? tracker.expenseSummary.totalSavingsSpent : 0;

        const totalExpense = totalNeeds + totalWants;
        const totalSpent = totalExpense;
        const currentMonthBalance = totalIncome - totalExpense;

        return {
            income: totalIncome,
            incomeSources,
            expenses,
            totalNeeds,
            totalWants,
            totalSavings,
            needsTarget,
            wantsTarget,
            savingsTarget,
            totalSpent,
            currentMonthBalance,
        };
    }
}
