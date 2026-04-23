import { injectable, inject } from "inversify";
import { IAnalyticsUseCase } from "./interfaces/analytics-usecase.interface";
import { AnalyticsResponseDTO, CategoryComparison, SpendingTrend } from "@application/dto/expense-tracker/analytics-response.dto";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";
import { FinancialSummary } from "@domain/entities/expense-tracker/types/expense-tracker.types";
import { generateInsights } from "@shared/utils/expense-tracker/insight-engine";

@injectable()
export class AnalyticsUseCase implements IAnalyticsUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
    ) { }

    async execute(userId: string, month?: string): Promise<AnalyticsResponseDTO> {
        const targetMonth = month || new Date().toISOString().slice(0, 7);
        const [year, monthNum] = targetMonth.split('-').map(Number);

        const targetMonthDate = new Date(year, monthNum - 1, 1);
        const lastMonthDate = new Date(year, monthNum - 2, 1);
        const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

        const [currentTracker, lastTracker] = await Promise.all([
            this._expenseTrackerRepository.findOne({ userId, month: targetMonth }),
            this._expenseTrackerRepository.findOne({ userId, month: lastMonthStr })
        ]);

        const thisMonthTotal = currentTracker ? (currentTracker.expenseSummary.totalNeedsSpent + currentTracker.expenseSummary.totalWantsSpent) : 0;
        const lastMonthTotal = lastTracker ? (lastTracker.expenseSummary.totalNeedsSpent + lastTracker.expenseSummary.totalWantsSpent) : 0;
        const totalIncome = currentTracker?.totalIncome || 0;

        const difference = thisMonthTotal - lastMonthTotal;
        const percentageChange = lastMonthTotal > 0 ? (difference / lastMonthTotal) * 100 : 0;

        const categoryMap: Map<string, { thisMonth: number, lastMonth: number }> = new Map();

        currentTracker?.expenses.forEach(exp => {
            const cat = exp.category;
            const current = categoryMap.get(cat) || { thisMonth: 0, lastMonth: 0 };
            current.thisMonth += exp.amount;
            categoryMap.set(cat, current);
        });

        lastTracker?.expenses.forEach(exp => {
            const cat = exp.category;
            const current = categoryMap.get(cat) || { thisMonth: 0, lastMonth: 0 };
            current.lastMonth += exp.amount;
            categoryMap.set(cat, current);
        });

        const categoryComparison: CategoryComparison[] = Array.from(categoryMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.thisMonth - a.thisMonth)
            .slice(0, 5);

        const spendingTrend: SpendingTrend[] = [];
        const daysInMonth = 31; 

        for (let i = 1; i <= daysInMonth; i++) {
            let thisMonthDay = 0;
            let lastMonthDay = 0;

            currentTracker?.expenses.forEach(exp => {
                if (new Date(exp.date).getDate() === i) thisMonthDay += exp.amount;
            });

            lastTracker?.expenses.forEach(exp => {
                if (new Date(exp.date).getDate() === i) lastMonthDay += exp.amount;
            });

            spendingTrend.push({ day: i, thisMonth: thisMonthDay, lastMonth: lastMonthDay });
        }

        const topCategoryItem = categoryComparison.length > 0 ? categoryComparison[0] : null;
        const topCategory = topCategoryItem ? topCategoryItem.name : "None";
        const topCategoryChange = topCategoryItem && topCategoryItem.lastMonth > 0
            ? ((topCategoryItem.thisMonth - topCategoryItem.lastMonth) / topCategoryItem.lastMonth) * 100
            : 0;

        const financialSummary: FinancialSummary = {
            totalSpent: thisMonthTotal,
            lastMonthSpent: lastMonthTotal,
            percentageChange,
            topCategory,
            topCategoryChange,
            spendingRatio: totalIncome > 0 ? thisMonthTotal / totalIncome : 0,
            investmentRatio: 0,
            needsRatio: totalIncome > 0 ? (currentTracker?.expenseSummary.totalNeedsSpent || 0) / totalIncome : 0,
            wantsRatio: totalIncome > 0 ? (currentTracker?.expenseSummary.totalWantsSpent || 0) / totalIncome : 0
        };

        const { insights, healthScore } = generateInsights(financialSummary);

        const mappedInsights = insights.map(i => ({
            type: i.type, 
            text: i.message,
            priority: i.priority,
            id: i.id,
            title: i.title
        }));

        return {
            comparison: {
                thisMonth: thisMonthTotal,
                lastMonth: lastMonthTotal,
                difference,
                percentageChange
            },
            categoryComparison,
            spendingTrend,
            insights: mappedInsights,
            healthScore
        };
    }
}
