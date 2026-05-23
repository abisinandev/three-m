import { BudgetPlanRequestDTO, BudgetPlanResultDTO } from "@application/dto/expense-tracker/budget-plan.dto";

export interface ICalculateBudgetPlanUseCase {
    execute(userId: string, data: BudgetPlanRequestDTO): Promise<BudgetPlanResultDTO>;
}
