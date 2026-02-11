import { Income } from "@domain/entities/expense-tracker/value-objects/income.vo";
import { ExpenseType, PaymentMode } from "./add-expense.dto";

export interface IncomeSourceDTO {
    source: string;
    amount: number;
}

export interface InvestmentDTO {
    schemeName: string;
    amount: number;
    type: string;
    date: Date;
}

export interface ExpenseDTO {
    amount: number;
    category: string;
    type: ExpenseType;
    description?: string;
    date: Date;
    paymentMode?: PaymentMode;
}

export interface ExpenseTrackerDTO {
    walletBalance?: number;
    income: number;
    incomeSources: IncomeSourceDTO[];
    investments: InvestmentDTO[];
    mutualFundInvestedAmount: number;
    totalInvestedAmount: number;
    totalOutflow: number;
    expenses?: ExpenseDTO[];
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