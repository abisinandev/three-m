import { NotificationDTO } from "@application/dtos/notification/notification.dto";

export interface IGetNotificationsUseCase {
    execute(userId: string, unreadOnly: boolean): Promise<NotificationDTO[]>;
}
