import { ContainerModule } from "inversify";
import { DASHBOARD_TYPES } from "./dashboard.types";
import { IDashboardUseCase } from "@application/use_cases/dashboard/interface/dashboard-usecase.interface";
import { DashboardUseCase } from "@application/use_cases/dashboard/dashboard.usecase";
import { DashboardController } from "@presentation/http/controllers/dashboard/user-dashboard.controller";
import { IAdminDashboardUseCase } from "@application/use_cases/dashboard/interface/admin-dashboard-usecase.interface";
import { AdminDashboardUseCase } from "@application/use_cases/dashboard/admin-dashboard.usecase";
import { AdminDashboardController } from "@presentation/http/controllers/dashboard/admin-dashboard.controller";

export const DashboardModule = new ContainerModule(({ bind }) => {
    // Use Case
    bind<IDashboardUseCase>(DASHBOARD_TYPES.DashboardUseCase).to(DashboardUseCase);
    bind<IAdminDashboardUseCase>(DASHBOARD_TYPES.AdminDashboardUseCase).to(AdminDashboardUseCase);

    // Controller
    bind<DashboardController>(DASHBOARD_TYPES.DashboardController).to(DashboardController);
    bind<AdminDashboardController>(DASHBOARD_TYPES.AdminDashboardController).to(AdminDashboardController);
});
