import { container } from "@infrastructure/inversify_di/container";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { NotificationController } from "@presentation/http/controllers/notification/notification.controller";
import { NotificationRoutes } from "@shared/routes";
import { Router } from "express";

const router = Router();

const controller = container.get<NotificationController>(NOTIFICATION_TYEPS.NotificationController);

router.get(NotificationRoutes.DEFUALT, controller.getNotifications.bind(controller));
router.patch(NotificationRoutes.MARK_ALL_READ, controller.markReadAll.bind(controller));
router.patch(NotificationRoutes.MARK_AS_READ, controller.markAsRead.bind(controller));

export default router;
