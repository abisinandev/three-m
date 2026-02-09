import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { ContainerModule } from "inversify";
import { NOTIFICATION_TYEPS } from "./notification.type";
import { SocketNotificationService } from "@infrastructure/providers/notification/notification.service";
import { NotificationController } from "@presentation/http/controllers/notification/notification.controller";

export const NotificationModules = new ContainerModule(({ bind }) => {
    bind<INotificationService>(NOTIFICATION_TYEPS.SocketNotificationService).to(SocketNotificationService);

    bind<NotificationController>(NOTIFICATION_TYEPS.NotificationController).to(NotificationController);
})