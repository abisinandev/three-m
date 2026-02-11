import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { IBaseRepository } from "../base-repository.interface";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";
import { ClientSession } from "mongoose";

export interface IExpenseTrackerRepository extends IBaseRepository<ExpenseTrackerEntity> {
    totalIncome(userId: string, session?: ClientSession): Promise<number>;
    addExpense(userId: string, dto: Expense, session?: ClientSession): Promise<ExpenseTrackerEntity | null>;
};