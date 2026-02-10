import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { inject, injectable } from "inversify";
import { ICreateNotificationUseCase } from "./interfaces/create-notification-usecase.interface";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NotificationEntity } from "@domain/entities/notification/notification.entity";

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
    constructor(
        @inject(NOTIFICATION_TYEPS.NotificationService) private readonly notificationService: INotificationService,
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly notificationRepository: INotificationRepository
    ) { }

    async execute(input: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
    }): Promise<void> {

        if (!input.userId || !input.message) {
            throw new Error("Invalid notification input");
        }

        const notification = NotificationEntity.create({
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message
        });

        await this.notificationRepository.save(notification);

        this.notificationService.send(input.userId, {
            type: input.type,
            title: input.title,
            message: input.message,
            createdAt: new Date(notification.createdAt)
        });
    }
}