import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { ContainerModule } from "inversify";
import { NOTIFICATION_TYEPS } from "./notification.type";
import { NotificationService } from "@infrastructure/providers/notification/notification.service";
import { NotificationController } from "@presentation/http/controllers/notification/notification.controller";
import { CreateNotificationUseCase } from "@application/use_cases/notification/create-notification.usecase";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NotificationRepository } from "@infrastructure/databases/repository/notification/notification.repository";

export const NotificationModules = new ContainerModule(({ bind }) => {
    bind<INotificationService>(NOTIFICATION_TYEPS.NotificationService).to(NotificationService);
    bind<INotificationRepository>(NOTIFICATION_TYEPS.NotificationRepository).to(NotificationRepository);

    bind<NotificationController>(NOTIFICATION_TYEPS.NotificationController).to(NotificationController);
    bind<CreateNotificationUseCase>(NOTIFICATION_TYEPS.CreateNotificationUseCase).to(CreateNotificationUseCase);
});