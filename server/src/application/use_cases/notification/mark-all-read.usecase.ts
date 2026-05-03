import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { inject, injectable } from "inversify";
import { IMarkAllReadUseCase } from "./interfaces/mark-all-read.usecase.interface";

@injectable()
export class MarkAllReadUseCase implements IMarkAllReadUseCase {
    constructor(
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly _notificationRepository: INotificationRepository
    ) { }

    async execute(userId: string): Promise<void> {
        await this._notificationRepository.markAllRead(userId);
    }
}
