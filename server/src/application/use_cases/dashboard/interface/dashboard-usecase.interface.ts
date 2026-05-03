import { DashboardDTO } from "@application/dto/user/dashboard.dto";

export interface IDashboardUseCase {
    execute(userId: string): Promise<DashboardDTO>;
}