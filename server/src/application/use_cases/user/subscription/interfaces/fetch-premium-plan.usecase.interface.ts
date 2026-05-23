import { PlanDTO } from "@application/dto/admin/subscription/subscription-management.dto";

export interface IFetchPremiumPlanUseCase {
    execute(): Promise<PlanDTO>;
}
