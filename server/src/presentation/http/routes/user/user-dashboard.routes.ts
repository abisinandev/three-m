import { container } from "@infrastructure/inversify_di/container";
import { DASHBOARD_TYPES } from "@infrastructure/inversify_di/features/dashboard/dashboard.types";
import type { DashboardController } from "@presentation/http/controllers/dashboard/user-dashboard.controller";
import { UserDashboardRoutes } from "@shared/routes/user-dashboard.routes";
import { Router } from "express";

const router = Router();

const dashboardController = container.get<DashboardController>(DASHBOARD_TYPES.DashboardController);

router.get(
    UserDashboardRoutes.OVERVIEW,
    dashboardController.getDashboard.bind(dashboardController),
);

export default router;
