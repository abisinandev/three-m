import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { AddExpenseRequest, AddExpenseResponse, AddIncomeRequest, ExpenseTrackerData, BudgetPlanRequest, BudgetPlanResponse, SimulationRequest, SimulationResult } from "../../../modules/user/expense-tracker/types/expense.types";

export const fetchExpenseTrackerData = async (month?: string): Promise<ExpenseTrackerData> => {
    const response = await api.get(API_ROUTES.USER.EXPENSE_TRACKER.GET_DATA, { params: { month } });
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
    };
};

export const addExpenseApi = async (data: AddExpenseRequest) => {
    const response = await api.post<AddExpenseResponse>(API_ROUTES.USER.EXPENSE_TRACKER.ADD_EXPENSE, data);
    return response.data;
};

export const addIncomeApi = async (data: AddIncomeRequest) => {
    const response = await api.post(API_ROUTES.USER.EXPENSE_TRACKER.ADD_INCOME, data);
    return response.data;
};

export const deleteExpenseApi = async (index: number) => {
    const response = await api.delete(API_ROUTES.USER.EXPENSE_TRACKER.DELETE_EXPENSE(index));
    return response.data;
};

export const fetchAnalyticsData = async (month?: string) => {
    const response = await api.get(API_ROUTES.USER.EXPENSE_TRACKER.ANALYTICS, { params: { month } });
    return response.data.data;
};

export const calculateBudgetPlan = async (data: BudgetPlanRequest): Promise<BudgetPlanResponse> => {
    const response = await api.post(API_ROUTES.USER.EXPENSE_TRACKER.BUDGET_PLAN, data);
    return response.data.data;
};

export const simulateBudget = async (data: SimulationRequest): Promise<SimulationResult> => {
    const response = await api.post(API_ROUTES.USER.EXPENSE_TRACKER.SIMULATE, data);
    return response.data.data;
};
