import { injectable, inject } from "inversify";
import { IAnalyticsUseCase } from "./interfaces/analytics-usecase.interface";
import { AnalyticsResponseDTO, CategoryComparison, SpendingTrend } from "@application/dto/expense-tracker/analytics-response.dto";
import { EXPENSE_TRACKER_TYPE } from "@infrastructure/inversify_di/features/expense-tracker/expense-tracker.type";
import { IExpenseTrackerRepository } from "@application/interfaces/repositories/feature/expense-tracker-repository.interface";

@injectable()
export class AnalyticsUseCase implements IAnalyticsUseCase {
    constructor(
        @inject(EXPENSE_TRACKER_TYPE.ExpenseTrackerRepository) private readonly _expenseTrackerRepository: IExpenseTrackerRepository,
    ) { }

    async execute(userId: string): Promise<AnalyticsResponseDTO> {
        const now = new Date();
        const currentMonthStr = now.toISOString().slice(0, 7);

        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

        const [currentTracker, lastTracker] = await Promise.all([
            this._expenseTrackerRepository.findOne({ userId, month: currentMonthStr }),
            this._expenseTrackerRepository.findOne({ userId, month: lastMonthStr })
        ]);

        const thisMonthTotal = currentTracker ? (currentTracker.expenseSummary.totalNeedsSpent + currentTracker.expenseSummary.totalWantsSpent) : 0;
        const lastMonthTotal = lastTracker ? (lastTracker.expenseSummary.totalNeedsSpent + lastTracker.expenseSummary.totalWantsSpent) : 0;

        const difference = thisMonthTotal - lastMonthTotal;
        const percentageChange = lastMonthTotal > 0 ? (difference / lastMonthTotal) * 100 : 0;

        // Category Comparison (Top 5 categories from this month vs last month)
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

        // Spending Trend (Daily breakdown)
        const spendingTrend: SpendingTrend[] = [];
        const daysInMonth = 31; // Simplified for comparison

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

        // Insights
        const insights: { type: 'info' | 'warning' | 'success', text: string }[] = [];
        if (difference < 0) {
            insights.push({ type: 'success', text: `You reduced overall spending by ${Math.abs(Math.round(percentageChange))}% compared to last month.` });
        } else if (difference > 0 && lastMonthTotal > 0) {
            insights.push({ type: 'warning', text: `Spending increased by ₹${difference.toLocaleString('en-IN')} this month.` });
        }

        // Top category insight
        if (categoryComparison.length > 0) {
            const topCat = categoryComparison[0];
            if (topCat.thisMonth > topCat.lastMonth && topCat.lastMonth > 0) {
                insights.push({ type: 'info', text: `${topCat.name} spending increased by ₹${(topCat.thisMonth - topCat.lastMonth).toLocaleString('en-IN')} vs last month.` });
            }
        }

        // Financial Health Score (Simulated logic based on budget and trends)
        let healthScore = 75; // Base score
        if (percentageChange < 0) healthScore += 10;
        if (percentageChange > 20) healthScore -= 15;
        if (currentTracker && currentTracker.totalIncome > 0) {
            const savingsRate = (currentTracker.totalIncome - thisMonthTotal) / currentTracker.totalIncome;
            if (savingsRate > 0.2) healthScore += 10;
            if (savingsRate < 0.1) healthScore -= 10;
        }
        healthScore = Math.min(100, Math.max(0, healthScore));

        return {
            comparison: {
                thisMonth: thisMonthTotal,
                lastMonth: lastMonthTotal,
                difference,
                percentageChange
            },
            categoryComparison,
            spendingTrend,
            insights,
            healthScore
        };
    }
}
