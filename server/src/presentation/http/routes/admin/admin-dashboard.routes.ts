import { Router } from "express";
import { container } from "@infrastructure/inversify_di/container";
import { DASHBOARD_TYPES } from "@infrastructure/inversify_di/features/dashboard/dashboard.types";
import { AdminDashboardController } from "@presentation/http/controllers/dashboard/admin-dashboard.controller";
import { AdminDashboardRoutes } from "@shared/routes/admin.routes";

const router = Router();

const adminDashboardController = container.get<AdminDashboardController>(DASHBOARD_TYPES.AdminDashboardController);

router.get(AdminDashboardRoutes.OVERVIEW, adminDashboardController.getOverview);

export default router;
