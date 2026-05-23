import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { inject, injectable } from "inversify";
import { IMarkAsReadUseCase } from "./interfaces/mark-as-read.usecase.interface";

@injectable()
export class MarkAsReadUseCase implements IMarkAsReadUseCase {
    constructor(
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly _notificationRepository: INotificationRepository
    ) { }

    async execute(id: string, userId: string): Promise<void> {
        await this._notificationRepository.markAsRead(id, userId);
    }
}
