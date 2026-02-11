import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

export interface ICreateNotificationUseCase {
    execute(input: {
            userId: string;
            type: NotificationType;
            title: string;
            message: string;
        }): Promise<void>;
}