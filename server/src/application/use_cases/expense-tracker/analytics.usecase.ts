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

        const insights: { type: 'info' | 'warning' | 'success', text: string }[] = [];

        // 1. Spend Growth Detection
        if (percentageChange > 15) {
            insights.push({ type: 'warning', text: `Spending growth is high (${Math.round(percentageChange)}% increase). Review your budget.` });
        }

        // 2. Category Spike Detection
        const categorySpike = [...categoryComparison].sort((a, b) => (b.thisMonth - b.lastMonth) - (a.thisMonth - a.lastMonth))[0];
        if (categorySpike && categorySpike.thisMonth > categorySpike.lastMonth && categorySpike.lastMonth > 0) {
            const increase = categorySpike.thisMonth - categorySpike.lastMonth;
            const percent = Math.round((increase / categorySpike.lastMonth) * 100);
            insights.push({ type: 'info', text: `Biggest increase: ${categorySpike.name} +₹${increase.toLocaleString('en-IN')} (${percent}%).` });
        }

        // 3. Savings Rate Improvement
        if (currentTracker && lastTracker && currentTracker.totalIncome > 0 && lastTracker.totalIncome > 0) {
            const currentSavingsRate = (currentTracker.totalIncome - thisMonthTotal) / currentTracker.totalIncome;
            const lastSavingsRate = (lastTracker.totalIncome - lastMonthTotal) / lastTracker.totalIncome;
            if (currentSavingsRate > lastSavingsRate) {
                const improvement = Math.round((currentSavingsRate - lastSavingsRate) * 100);
                if (improvement > 0) insights.push({ type: 'success', text: `Savings rate improved by ${improvement}% this month.` });
            }
        }

        // 4. Budget Balanced
        if (insights.length < 3 && percentageChange < 5 && percentageChange > -5 && thisMonthTotal > 0) {
            insights.push({ type: 'success', text: "You are maintaining balanced spending this month." });
        }

        // Limit to 3 insights
        const finalInsights = insights.slice(0, 3);

        let healthScore = 75; 
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
            insights: finalInsights,
            healthScore
        };
    }
}
