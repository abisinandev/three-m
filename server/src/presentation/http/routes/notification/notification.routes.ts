import { container } from "@infrastructure/inversify_di/container";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { NotificationController } from "@presentation/http/controllers/notification/notification.controller";
import { NotificationRoutes } from "@shared/routes";
import { Router } from "express";

const router = Router();

const notificationController = container.get<NotificationController>(NOTIFICATION_TYEPS.NotificationController);

router.get(NotificationRoutes.DEFUALT, notificationController.getNotifications.bind(notificationController));
router.patch(NotificationRoutes.MARK_AS_READ, notificationController.markAsRead.bind(notificationController));

export default router;
