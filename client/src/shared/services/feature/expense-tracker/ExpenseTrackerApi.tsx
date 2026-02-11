import api from "@lib/axiosUser"

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
    mutualFundInvestedAmount: number,
    sipInvestedAmount: number,
    stocks: number,
    totalInvestedAmount: number,
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

export const ExpenseTrackerData = async (month?: string): Promise<ExpenseTrackerData> => {
    const response = await api.get('/user/expense-tracker', { params: { month } });
    return {
        walletBalance: response.data.data.walletBalance,
        mutualFundInvestedAmount: response.data.data.mutualFundInvestedAmount,
        sipInvestedAmount: response.data.data.sipInvestedAmount,
        stocks: response.data.data.stocks,
        totalInvestedAmount: response.data.data.totalInvestedAmount,
        income: response.data.data.income,
        incomeSources: response.data.data.incomeSources || [],
        investments: response.data.data.investments || [],
        expenses: response.data.data.expenses || [],
        totalNeeds: response.data.data.totalNeeds || 0,
        totalWants: response.data.data.totalWants || 0,
        needsTarget: response.data.data.needsTarget,
        wantsTarget: response.data.data.wantsTarget,
        savingsTarget: response.data.data.savingsTarget,
        totalSpent: response.data.data.totalSpent,
        currentMonthBalance: response.data.data.currentMonthBalance,
        savingsGap: response.data.data.savingsGap,
        isSavingsGoalMet: response.data.data.isSavingsGoalMet,
    }
}

export const AddExpenseApi = async (data: AddExpenseRequest) => {
    const response = await api.post<AddExpenseResponse>('/user/expense-tracker/add-expense', data);
    return response.data;
}

export const AddIncomeApi = async (data: AddIncomeRequest) => {
    const response = await api.post('/user/expense-tracker/add-income', data);
    return response.data
}

export const DeleteExpenseApi = async (index: number) => {
    const response = await api.delete(`/user/expense-tracker/delete-expense/${index}`);
    return response.data;
}

export const FetchAnalyticsData = async (month?: string) => {
    const response = await api.get('/user/expense-tracker/analytics', { params: { month } });
    return response.data;
}
