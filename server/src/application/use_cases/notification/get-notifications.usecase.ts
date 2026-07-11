import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { inject, injectable } from "inversify";
import { IGetNotificationsUseCase } from "./interfaces/get-notifications.usecase.interface";
import { NotificationDTO } from "@application/dto/notification/notification.dto";

@injectable()
export class GetNotificationsUseCase implements IGetNotificationsUseCase {
    constructor(
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly _notificationRepository: INotificationRepository
    ) { }

    async execute(userId: string, unreadOnly: boolean): Promise<NotificationDTO[]> {
        const notifications = await this._notificationRepository.findByUser(userId, unreadOnly);
        
        if (!notifications) return [];
        
        return notifications.map(n => n.toJSON() as NotificationDTO);
    }
}
