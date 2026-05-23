export interface AddExpenseRequest {
    amount: number;
    category: string;
    type: 'NEED' | 'WANT' | 'SAVING';
    description?: string;
    date?: string;
    paymentMode?: 'CASH' | 'BANK' | 'UPI' | 'WALLET';
}

export interface AddExpenseResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface AddIncomeRequest {
    amount: number;
    source: string;
}

export interface IncomeSource {
    source: string;
    amount: number;
}

export interface Expense {
    amount: number;
    category: string;
    type: 'NEED' | 'WANT' | 'SAVING';
    description?: string;
    date: Date;
    paymentMode?: 'CASH' | 'BANK' | 'UPI' | 'WALLET';
}

export interface ExpenseTrackerData {
    savingsGap?: number;
    walletBalance?: number;
    mutualFundInvestedAmount?: number;
    sipInvestedAmount?: number;
    stocks?: unknown[];
    totalInvestedAmount?: number;
    investments?: unknown[];
    income: number;
    incomeSources: IncomeSource[];
    expenses?: Expense[];
    totalNeeds?: number;
    totalWants?: number;
    totalSavings?: number;
    needsTarget: number;
    wantsTarget: number;
    savingsTarget: number;
    totalSpent: number;
    currentMonthBalance: number;
    healthScore?: number;
    isSavingsGoalMet?: boolean;
}

export type AdjustmentType = 'INCOME' | 'CATEGORY';

export interface SimulationAdjustment {
    type: AdjustmentType;
    categoryType?: 'NEED' | 'WANT' | 'SAVING';
    amount: number;
    description?: string;
}

export interface SimulationRequest {
    month?: string;
    adjustments: SimulationAdjustment[];
}

export interface SimulationResult {
    original: ExpenseTrackerData;
    simulated: ExpenseTrackerData;
    impact: {
        savingsChange: number;
        balanceChange: number;
        isBetter: boolean;
    };
}

export interface BudgetPlanRequest {
    income: number;
    needsTotal: number;
    wantsTotal: number;
    savingsTotal: number;
    month: string;
}

export interface BudgetPlanResponse {
    health: {
        color: string;
        label: string;
        score: number;
    };
    allocation: {
        totalSpent: number;
        remaining: number;
    };
    insights: {
        type: 'success' | 'critical' | 'warning' | 'info';
        title: string;
        message: string;
    }[];
}
