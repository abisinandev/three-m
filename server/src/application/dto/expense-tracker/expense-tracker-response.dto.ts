import { Insight } from "@domain/entities/expense-tracker/types/expense-tracker.types";
import { ExpenseType, PaymentMode } from "./add-expense.dto";

export interface IncomeSourceDTO {
    source: string;
    amount: number;
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
    income: number;
    incomeSources: IncomeSourceDTO[];
    expenses?: ExpenseDTO[];
    totalNeeds?: number;
    totalWants?: number;
    totalSavings?: number;

    needsTarget: number;
    wantsTarget: number;
    savingsTarget: number;
    totalSpent: number;
    currentMonthBalance: number;
    healthScore?: number;
    insights?: Insight[];
}