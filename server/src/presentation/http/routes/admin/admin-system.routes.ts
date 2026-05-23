import { Router } from "express";
import { container } from "@infrastructure/inversify_di/container";
import { ADMIN_TYPES } from "@infrastructure/inversify_di/features/admin/admin.types";
import { AdminSystemRoutes } from "@shared/routes/admin.routes";
import type { AdminSystemController } from "@presentation/http/controllers/admin/admin-system.controller";

const router = Router();
const adminSystemController = container.get<AdminSystemController>(ADMIN_TYPES.AdminSystemController);

router.get(AdminSystemRoutes.FETCH_LOGS, adminSystemController.getJobLogs.bind(adminSystemController));
router.get(AdminSystemRoutes.FETCH_LOG_DETAIL, adminSystemController.getJobLogDetail.bind(adminSystemController));

export default router;
