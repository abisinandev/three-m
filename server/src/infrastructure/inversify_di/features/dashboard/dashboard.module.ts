import { ContainerModule } from "inversify";
import { DASHBOARD_TYPES } from "./dashboard.types";
import { IDashboardUseCase } from "@application/use_cases/dashboard/interface/dashboard-usecase.interface";
import { DashboardUseCase } from "@application/use_cases/dashboard/dashboard.usecase";
import { DashboardController } from "@presentation/http/controllers/dashboard/user-dashboard.controller";

export const DashboardModule = new ContainerModule(({ bind }) => {
    // Use Case
    bind<IDashboardUseCase>(DASHBOARD_TYPES.DashboardUseCase).to(DashboardUseCase);

    // Controller
    bind<DashboardController>(DASHBOARD_TYPES.DashboardController).to(DashboardController);
});
