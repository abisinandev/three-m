export interface BudgetItem {
    id: string;
    label: string;
    amount: number;
}

export interface BudgetPlannerInput {
    income: number;
    needs: BudgetItem[];
    wants: BudgetItem[];
    savings: BudgetItem[];
}

export interface AllocationResult {
    needsTotal: number;
    wantsTotal: number;
    savingsTotal: number;
    needsPct: number;
    wantsPct: number;
    savingsPct: number;
    totalSpent: number;
    remaining: number;
    remainingPct: number;
}

export interface HealthResult {
    score: number;
    grade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    label: string;
    color: string;
    bgColor: string;
}

export interface Insight {
    type: 'success' | 'warning' | 'danger' | 'info';
    message: string;
    icon: string;
}

export interface BudgetAnalysis {
    allocation: AllocationResult;
    health: HealthResult;
    insights: Insight[];
    deviations: {
        needs: number;   // vs 50% ideal
        wants: number;   // vs 30% ideal
        savings: number; // vs 20% ideal
    };
    suggestions: { action: string; impact: string; type: 'cut' | 'boost' | 'shift' }[];
}

// ─── Core Allocation Analyzer ────────────────────────────────────────────────

export const analyzeAllocation = (input: BudgetPlannerInput): BudgetAnalysis => {
    const { income, needs, wants, savings } = input;

    const needsTotal = needs.reduce((s, i) => s + (i.amount || 0), 0);
    const wantsTotal = wants.reduce((s, i) => s + (i.amount || 0), 0);
    const savingsTotal = savings.reduce((s, i) => s + (i.amount || 0), 0);
    const totalSpent = needsTotal + wantsTotal;
    const remaining = income - totalSpent - savingsTotal;

    const safe = (n: number) => income > 0 ? Math.round((n / income) * 1000) / 10 : 0;

    const allocation: AllocationResult = {
        needsTotal,
        wantsTotal,
        savingsTotal,
        needsPct: safe(needsTotal),
        wantsPct: safe(wantsTotal),
        savingsPct: safe(savingsTotal),
        totalSpent,
        remaining,
        remainingPct: safe(remaining),
    };

    const deviations = {
        needs: allocation.needsPct - 50,
        wants: allocation.wantsPct - 30,
        savings: allocation.savingsPct - 20,
    };

    const health = evaluateHealth(allocation, deviations, income);
    const insights = generateInsights(allocation, deviations, income);
    const suggestions = generateSuggestions(allocation, deviations);

    return { allocation, health, insights, deviations, suggestions };
};

// ─── Budget Health Evaluator ──────────────────────────────────────────────────

const evaluateHealth = (
    alloc: AllocationResult,
    dev: { needs: number; wants: number; savings: number },
    income: number
): HealthResult => {
    let score = 100;

    // Penalize overspending on needs beyond 50%
    if (dev.needs > 10) score -= 20;
    else if (dev.needs > 5) score -= 10;

    // Penalize overspending on wants beyond 30%
    if (dev.wants > 15) score -= 25;
    else if (dev.wants > 5) score -= 12;

    // Penalize under-saving
    if (alloc.savingsPct < 5) score -= 30;
    else if (alloc.savingsPct < 10) score -= 15;
    else if (alloc.savingsPct < 20) score -= 5;

    // Penalize negative remaining balance
    if (alloc.remaining < 0) score -= 20;

    // Penalize no income
    if (income <= 0) score = 0;

    score = Math.max(0, Math.min(100, score));

    if (score >= 80) return { score, grade: 'EXCELLENT', label: 'Excellent Budget', color: '#00C853', bgColor: 'bg-emerald-500/10' };
    if (score >= 60) return { score, grade: 'GOOD', label: 'Healthy Budget', color: '#3B82F6', bgColor: 'bg-blue-500/10' };
    if (score >= 40) return { score, grade: 'FAIR', label: 'Needs Attention', color: '#f59e0b', bgColor: 'bg-amber-500/10' };
    return { score, grade: 'POOR', label: 'Budget at Risk', color: '#F43F5E', bgColor: 'bg-rose-500/10' };
};

// ─── Smart Insights Generator ─────────────────────────────────────────────────

const generateInsights = (
    alloc: AllocationResult,
    dev: { needs: number; wants: number; savings: number },
    income: number
): Insight[] => {
    const insights: Insight[] = [];

    if (income <= 0) {
        insights.push({ type: 'info', icon: '💡', message: 'Enter your monthly income to get personalized insights.' });
        return insights;
    }

    // Savings insights
    if (alloc.savingsPct >= 20) {
        insights.push({ type: 'success', icon: '✅', message: `Your savings allocation of ${alloc.savingsPct.toFixed(1)}% is healthy — above the recommended 20%.` });
    } else if (alloc.savingsPct > 0) {
        insights.push({ type: 'warning', icon: '⚠️', message: `You are saving ${alloc.savingsPct.toFixed(1)}% of income. Aim for at least 20% (₹${(income * 0.20).toLocaleString('en-IN')}) to build wealth.` });
    } else {
        insights.push({ type: 'danger', icon: '🔴', message: 'No savings allocated this month. Even a small SIP protects your future.' });
    }

    // Needs insights
    if (dev.needs > 15) {
        insights.push({ type: 'danger', icon: '🔴', message: `Your fixed expenses are consuming ${alloc.needsPct.toFixed(1)}% of income — well above the 50% ideal. Consider reviewing rent or EMI obligations.` });
    } else if (dev.needs > 5) {
        insights.push({ type: 'warning', icon: '⚠️', message: `Essential expenses at ${alloc.needsPct.toFixed(1)}% slightly exceed the 50% guideline. Look for areas to optimize.` });
    } else if (alloc.needsTotal > 0) {
        insights.push({ type: 'success', icon: '✅', message: `Essential spending is well-controlled at ${alloc.needsPct.toFixed(1)}% — within the 50% target.` });
    }

    // Wants insights
    if (dev.wants > 10) {
        insights.push({ type: 'danger', icon: '🔴', message: `Discretionary spending at ${alloc.wantsPct.toFixed(1)}% exceeds the recommended 30%. Dining, entertainment, and subscriptions can add up quickly.` });
    } else if (dev.wants > 3) {
        insights.push({ type: 'warning', icon: '⚠️', message: `Your wants spending (${alloc.wantsPct.toFixed(1)}%) is slightly above the 30% guideline.` });
    } else if (alloc.wantsTotal > 0) {
        insights.push({ type: 'success', icon: '✅', message: `Lifestyle spending is within healthy limits at ${alloc.wantsPct.toFixed(1)}%.` });
    }

    // Remaining / Unallocated
    if (alloc.remaining < 0) {
        insights.push({ type: 'danger', icon: '💸', message: `You are overspending by ₹${Math.abs(alloc.remaining).toLocaleString('en-IN')} this month. Immediate spending reduction is recommended.` });
    } else if (alloc.remaining > income * 0.1 && alloc.savingsPct < 20) {
        insights.push({ type: 'info', icon: '💡', message: `₹${alloc.remaining.toLocaleString('en-IN')} is unallocated. Consider moving this to savings or an SIP for better returns.` });
    }

    return insights;
};

// ─── Smart Suggestions Generator ─────────────────────────────────────────────

const generateSuggestions = (
    alloc: AllocationResult,
    dev: { needs: number; wants: number; savings: number }
): { action: string; impact: string; type: 'cut' | 'boost' | 'shift' }[] => {
    const suggestions: { action: string; impact: string; type: 'cut' | 'boost' | 'shift' }[] = [];

    if (dev.wants > 5) {
        suggestions.push({
            action: 'Reduce Wants',
            impact: `Cut lifestyle spending toward the 30% target`,
            type: 'cut',
        });
    }

    if (dev.savings < 0) {
        suggestions.push({
            action: 'Boost Savings',
            impact: `Move unallocated funds to savings or SIP`,
            type: 'boost',
        });
    }

    if (dev.needs > 5) {
        suggestions.push({
            action: 'Optimize Fixed Costs',
            impact: `Review rent, utilities, or EMI obligations`,
            type: 'shift',
        });
    }

    if (alloc.remaining > 0 && dev.savings < 0) {
        suggestions.push({
            action: 'Optimize Allocation',
            impact: `Redirect unspent balance into savings`,
            type: 'shift',
        });
    }

    return suggestions.slice(0, 3);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const generateId = () => Math.random().toString(36).slice(2, 9);
