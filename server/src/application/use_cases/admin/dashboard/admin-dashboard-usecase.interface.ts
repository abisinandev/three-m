import { AdminDashboardDTO } from "@application/dto/admin/admin-dashboard.dto";

export interface IAdminDashboardUseCase {
    execute(): Promise<AdminDashboardDTO>;
}
