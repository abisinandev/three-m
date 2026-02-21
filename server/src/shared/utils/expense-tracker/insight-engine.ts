import { FinancialSummary, Insight, InsightResult } from "@domain/entities/expense-tracker/types/expense-tracker.types";

export const generateInsights = (summary: FinancialSummary): InsightResult => {
    const insights: Insight[] = [];
    let healthScore = 100;

    if (summary.spendingRatio > 1) {
        insights.push({
            id: 'critical-overspending',
            type: 'critical',
            priority: 1,
            title: 'Critical Overspending',
            message: `You have spent ${(summary.spendingRatio * 100).toFixed(0)}% of your income. Reduce expenses immediately to avoid debt.`
        });
        healthScore -= 30;
    }

    if (summary.percentageChange > 20) {
        insights.push({
            id: 'spending-spike',
            type: 'warning',
            priority: 2,
            title: 'Spending Spike Detected',
            message: `Your spending is ${summary.percentageChange.toFixed(0)}% higher than last month.`
        });
        healthScore -= 15;
    }

    if (summary.investmentRatio >= 0.2) {
        insights.push({
            id: 'good-savings',
            type: 'success',
            priority: 3,
            title: 'Strong Savings Habit',
            message: `Great job! You are saving ${(summary.investmentRatio * 100).toFixed(0)}% of your income.`
        });
        healthScore += 10;
    }

    if (summary.topCategoryChange > 30) {
        insights.push({
            id: 'category-spike',
            type: 'warning',
            priority: 4,
            title: `High Spending in ${summary.topCategory}`,
            message: `Spending on ${summary.topCategory} has increased by ${summary.topCategoryChange.toFixed(0)}%.`
        });
        healthScore -= 10;
    }

    if (summary.spendingRatio < 0.6 && summary.spendingRatio > 0) { 
        insights.push({
            id: 'budget-control',
            type: 'success',
            priority: 5,
            title: 'Excellent Budget Control',
            message: `You have only spent ${(summary.spendingRatio * 100).toFixed(0)}% of your income this month.`
        });
        healthScore += 15;
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    insights.sort((a, b) => a.priority - b.priority);

    return {
        insights: insights.slice(0, 3),
        healthScore
    };
};
