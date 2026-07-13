import { NotificationDTO } from "@application/dto/notification/notification.dto";

export interface IGetNotificationsUseCase {
    execute(userId: string, unreadOnly: boolean): Promise<NotificationDTO[]>;
}
