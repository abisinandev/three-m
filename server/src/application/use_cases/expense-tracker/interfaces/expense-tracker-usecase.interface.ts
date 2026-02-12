import { ExpenseTrackerDTO } from "@application/dto/expense-tracker/expense-tracker-response.dto";

export interface IExpenseTrackerUseCase {
    execute(userId: string, month?: string): Promise<ExpenseTrackerDTO>;
}