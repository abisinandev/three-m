import { Router } from "express";
import { container } from "@infrastructure/inversify_di/container";
import { DASHBOARD_TYPES } from "@infrastructure/inversify_di/features/dashboard/dashboard.types";
import { AdminDashboardController } from "@presentation/http/controllers/dashboard/admin-dashboard.controller";

const router = Router();

const adminDashboardController = container.get<AdminDashboardController>(DASHBOARD_TYPES.AdminDashboardController);

router.get("/overview", adminDashboardController.getOverview);

export default router;
