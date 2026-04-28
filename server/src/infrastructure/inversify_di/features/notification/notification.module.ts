import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { ContainerModule } from "inversify";
import { NOTIFICATION_TYEPS } from "./notification.type";
import { NotificationService } from "@infrastructure/providers/notification/notification.service";
import { NotificationController } from "@presentation/http/controllers/notification/notification.controller";
import { ICreateNotificationUseCase } from "@application/use_cases/notification/interfaces/create-notification.usecase.interface";
import { CreateNotificationUseCase } from "@application/use_cases/notification/create-notification.usecase";
import { IGetNotificationsUseCase } from "@application/use_cases/notification/interfaces/get-notifications.usecase.interface";
import { GetNotificationsUseCase } from "@application/use_cases/notification/get-notifications.usecase";
import { IMarkAllReadUseCase } from "@application/use_cases/notification/interfaces/mark-all-read.usecase.interface";
import { MarkAllReadUseCase } from "@application/use_cases/notification/mark-all-read.usecase";
import { IMarkAsReadUseCase } from "@application/use_cases/notification/interfaces/mark-as-read.usecase.interface";
import { MarkAsReadUseCase } from "@application/use_cases/notification/mark-as-read.usecase";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NotificationRepository } from "@infrastructure/databases/repository/notification/notification.repository";
import { ISocketService } from "@application/interfaces/services/notification/socket-service.interface";
import { SocketService } from "@infrastructure/providers/notification/socket.service";

export const NotificationModules = new ContainerModule(({ bind }) => {
    bind<INotificationService>(NOTIFICATION_TYEPS.NotificationService).to(NotificationService);
    bind<INotificationRepository>(NOTIFICATION_TYEPS.NotificationRepository).to(NotificationRepository);
    bind<ISocketService>(NOTIFICATION_TYEPS.SocketService).to(SocketService).inSingletonScope();

    bind<NotificationController>(NOTIFICATION_TYEPS.NotificationController).to(NotificationController);
    bind<ICreateNotificationUseCase>(NOTIFICATION_TYEPS.CreateNotificationUseCase).to(CreateNotificationUseCase);
    bind<IGetNotificationsUseCase>(NOTIFICATION_TYEPS.GetNotificationsUseCase).to(GetNotificationsUseCase);
    bind<IMarkAllReadUseCase>(NOTIFICATION_TYEPS.MarkAllReadUseCase).to(MarkAllReadUseCase);
    bind<IMarkAsReadUseCase>(NOTIFICATION_TYEPS.MarkAsReadUseCase).to(MarkAsReadUseCase);
});