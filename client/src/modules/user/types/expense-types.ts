// Interface for adding an expense
export interface AddExpenseRequest {
    amount: number;
    category: string;
    type: 'NEED' | 'WANT';
    description?: string;
    date?: string;
    paymentMode?: 'CASH' | 'BANK' | 'UPI' | 'WALLET';
}

export interface AddExpenseResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface AddIncomeRequest {
    amount: number;
    source: string;
}

export interface IncomeSource {
    source: string;
    amount: number;
}

export interface Investment {
    schemeName: string;
    amount: number;
    type: string;
    date: Date;
}

export interface Expense {
    amount: number;
    category: string;
    type: 'NEED' | 'WANT';
    description?: string;
    date: Date;
    paymentMode?: 'CASH' | 'BANK' | 'UPI' | 'WALLET';
}

export interface ExpenseTrackerData {
    mutualFundInvestedAmount: number;
    sipInvestedAmount: number;
    stocks: number;
    totalInvestedAmount: number;
    walletBalance: number;
    income: number;
    incomeSources: IncomeSource[];
    investments: Investment[];
    expenses?: Expense[];
    totalNeeds?: number;
    totalWants?: number;
    needsTarget: number;
    wantsTarget: number;
    savingsTarget: number;
    totalSpent: number;
    currentMonthBalance: number;
    savingsGap: number;
    isSavingsGoalMet: boolean;
}
