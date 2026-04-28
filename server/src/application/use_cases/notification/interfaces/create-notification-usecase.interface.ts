import { NotificationData, NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

export interface ICreateNotificationUseCase {
    execute(input: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data?: NotificationData;
    }): Promise<void>;
}