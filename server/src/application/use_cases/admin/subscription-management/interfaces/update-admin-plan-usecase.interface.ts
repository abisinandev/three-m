import { UpdatePlanDTO } from "@application/dto/admin/subscription/update-plan.dto";

export interface IUpdateAdminPlanUseCase {
    execute(request: UpdatePlanDTO): Promise<void>;
}
