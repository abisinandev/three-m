import { FinancialSummary, Insight, InsightResult } from "@domain/entities/expense-tracker/types/expense-tracker.types";

export const generateInsights = (summary: FinancialSummary): InsightResult => {
    const insights: Insight[] = [];
    let healthScore = 100;

    // 1. Total Spending Ratio (Goal: <= 1.0, ideally <= 0.8)
    if (summary.spendingRatio > 1) {
        const excess = ((summary.spendingRatio - 1) * 100).toFixed(0);
        insights.push({
            id: 'critical-overspending',
            type: 'critical',
            priority: 1,
            title: 'Critical Overspending',
            message: `You have spent ${excess}% more than your total income. Immediate adjustment required.`
        });
        healthScore -= 40 + (summary.spendingRatio - 1) * 50; // Dynamic penalty
    }

    // 2. Needs Ratio (Goal: <= 0.5)
    if (summary.needsRatio > 0.5) {
        const excessPercent = ((summary.needsRatio - 0.5) * 100).toFixed(1);
        insights.push({
            id: 'needs-over-budget',
            type: 'warning',
            priority: 3,
            title: 'Needs Above 50%',
            message: `Essential spending is at ${(summary.needsRatio * 100).toFixed(1)}%. Try to reduce by ${excessPercent}% to hit target.`
        });
        healthScore -= (summary.needsRatio - 0.5) * 60; // 0.6 -> -6 points, 0.7 -> -12 points etc.
    }

    // 3. Wants Ratio (Goal: <= 0.3)
    if (summary.wantsRatio > 0.3) {
        const excessPercent = ((summary.wantsRatio - 0.3) * 100).toFixed(1);
        insights.push({
            id: 'wants-over-budget',
            type: 'warning',
            priority: 2,
            title: 'Wants Above 30%',
            message: `Discretionary spending is ${(summary.wantsRatio * 100).toFixed(1)}%. Your budget allows for 30%.`
        });
        healthScore -= (summary.wantsRatio - 0.3) * 80;
    }

    // 4. Savings Ratio (Goal: >= 0.2)
    const currentSavingsRatio = 1 - summary.spendingRatio;
    if (currentSavingsRatio < 0.2) {
        const deficit = ((0.2 - currentSavingsRatio) * 100).toFixed(1);
        insights.push({
            id: 'low-savings',
            type: 'warning',
            priority: 4,
            title: 'Savings Below 20%',
            message: `You're saving ${(currentSavingsRatio * 100).toFixed(1)}%. Aim for 20% to build your safety net.`
        });
        healthScore -= (0.2 - Math.max(0, currentSavingsRatio)) * 50;
    }

    // 5. Month-over-Month Change
    if (summary.percentageChange > 15) {
        insights.push({
            id: 'spending-spike',
            type: 'warning',
            priority: 2,
            title: 'Spending Spike',
            message: `Your spending increased by ${summary.percentageChange.toFixed(0)}% compared to last month.`
        });
        healthScore -= 10;
    }

    // Success Insights
    if (healthScore >= 90) {
        insights.push({
            id: 'excellent-control',
            type: 'success',
            priority: 5,
            title: 'Elite Financial Health',
            message: "Your spending ratios are perfectly aligned with the 50-30-20 rule."
        });
    } else if (healthScore >= 75) {
        insights.push({
            id: 'good-progress',
            type: 'success',
            priority: 5,
            title: 'Good Budgeting',
            message: "You're maintaining a stable budget. Minor tweaks could reach optimal levels."
        });
    }

    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    insights.sort((a, b) => a.priority - b.priority);

    return {
        insights: insights.slice(0, 3),
        healthScore
    };
};
