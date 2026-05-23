import { AddExpenseDTO } from "@application/dto/expense-tracker/add-expense.dto";

export interface IAddExpenseUseCase {
    execute(dto: AddExpenseDTO, userId: string): Promise<void>;
}