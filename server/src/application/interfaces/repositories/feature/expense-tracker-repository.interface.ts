import { ExpenseTrackerEntity } from "@domain/entities/expense-tracker/expense-tracker.entity";
import { IBaseRepository } from "../base-repository.interface";
import { Expense } from "@domain/entities/expense-tracker/value-objects/expense.vo";

export interface IExpenseTrackerRepository extends IBaseRepository<ExpenseTrackerEntity> {
    totalIncome(userId: string): Promise<number>;
    addExpense(userId: string, dto: Expense): Promise<ExpenseTrackerEntity | null>;
};