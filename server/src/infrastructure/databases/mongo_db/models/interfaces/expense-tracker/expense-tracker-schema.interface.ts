import { ExpenseType, PaymentMode } from '@application/dto/expense-tracker/add-expense.dto';
import { IncomeSource, SavingsState } from '@domain/entities/expense-tracker/types/expense-tracker.types';
import { Document } from 'mongoose';


export interface IIncome {
    amount: number;
    source: IncomeSource;
}

export interface IExpense {
    amount: number;
    category: string;
    type: ExpenseType;
    description?: string;
    date: Date;
    paymentMode?: PaymentMode;
}

export interface IBudget {
    needsLimit: number,
    wantsLimit: number,
    savingsTarget: number
}

export interface IExpenseSummary {
    needsSpent: number,
    wantsSpent: number,
    needsUsage: number,
    wantsUsage: number
}

export interface ISavingsStatus {
    target: number,
    actual: number,
    gap: number,
    status: SavingsState
}

export interface ExpenseTrackerDocument extends Document {
    id: string;
    userId: string;
    month: string;

    incomes: IIncome[];
    budget: IBudget;
    expenses: IExpense[];
    expenseSummary: IExpenseSummary;
    savingsStatus: ISavingsStatus;
    createdAt: Date;
    updatedAt: Date;
}
