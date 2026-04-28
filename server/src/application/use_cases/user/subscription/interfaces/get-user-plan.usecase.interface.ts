import { PlanEntity } from "@domain/entities/subscription/plan.entity";

export interface IGetUserPlanUseCase {
    execute(userId: string): Promise<PlanEntity | null>;
}
