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
        healthScore -= 40;
    }

    if (summary.needsRatio > 0.5) {
        const excess = ((summary.needsRatio - 0.5) * 100).toFixed(0);
        insights.push({
            id: 'needs-over-budget',
            type: 'warning',
            priority: 3,
            title: 'High Essential Costs',
            message: `Your 'Needs' are ${excess}% over the 50% recommendation. Consider reviewing utility or housing costs.`
        });
        healthScore -= 15;
    }

    if (summary.wantsRatio > 0.3) {
        const excess = ((summary.wantsRatio - 0.3) * 100).toFixed(0);
        insights.push({
            id: 'wants-over-budget',
            type: 'warning',
            priority: 2,
            title: 'Excessive Wants',
            message: `Discretionary spending is ${excess}% above the 30% target. Try cutting back on non-essentials.`
        });
        healthScore -= 20;
    }

    if (summary.percentageChange > 20) {
        insights.push({
            id: 'spending-spike',
            type: 'warning',
            priority: 2,
            title: 'Spending Spike Detected',
            message: `Your spending is ${summary.percentageChange.toFixed(0)}% higher than last month.`
        });
        healthScore -= 10;
    }

    if (summary.topCategoryChange > 30) {
        insights.push({
            id: 'category-spike',
            type: 'warning',
            priority: 4,
            title: `High Spending in ${summary.topCategory}`,
            message: `Spending on ${summary.topCategory} has increased by ${summary.topCategoryChange.toFixed(0)}%.`
        });
        healthScore -= 5;
    }

    const savingsRatio = 1 - summary.spendingRatio;
    if (summary.spendingRatio <= 0.8 && savingsRatio >= 0.2) {
        insights.push({
            id: 'budget-control',
            type: 'success',
            priority: 5,
            title: 'Excellent Budget Control',
            message: `Great job! You have saved ${(savingsRatio * 100).toFixed(0)}% of your income this month.`
        });

    } else if (summary.spendingRatio > 0 && summary.spendingRatio < 0.6) {
        insights.push({
            id: 'good-balance',
            type: 'success',
            priority: 5,
            title: 'Balanced Spending',
            message: `You've maintained a healthy spending ratio below 60%.`
        });
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    insights.sort((a, b) => a.priority - b.priority);

    return {
        insights: insights.slice(0, 3),
        healthScore
    };
};
