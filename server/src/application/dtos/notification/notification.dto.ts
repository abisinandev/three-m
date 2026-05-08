import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";

export interface NotificationDTO {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: Record<string, unknown>;
}
