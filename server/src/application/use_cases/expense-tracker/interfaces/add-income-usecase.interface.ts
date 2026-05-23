import { AddIncomeDTO } from "@application/dto/expense-tracker/add-income.dto";

export interface IAddIncomeUseCase {
    execute(data: AddIncomeDTO, userId: string): Promise<void>;
}