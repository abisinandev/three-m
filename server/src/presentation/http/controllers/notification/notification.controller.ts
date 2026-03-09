import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { HttpStatus } from "@domain/enum/express/status-code";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationController {
    constructor(
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly notificationRepository: INotificationRepository
    ) { }

    async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const unreadOnly = req.query.filter === 'unread';
            const notifications = await this.notificationRepository.findByUser(userId, unreadOnly);
            return ResponseHelper.success(
                res,
                SuccessMessages.DATA.FETCHED,
                notifications,
                HttpStatus.OK
            )
        } catch (error) {
            next(error);
        }
    }

    async markReadAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            await this.notificationRepository.markAllRead(userId);
            return ResponseHelper.success(
                res,
                SuccessMessages.NOTIFICATION.MARK_AS_READ,
                null,
                HttpStatus.OK
            )
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const { id } = req.params;

            await this.notificationRepository.markAsRead(id as string, userId);
            return ResponseHelper.success(
                res,
                SuccessMessages.NOTIFICATION.MARK_AS_READ,
                null,
                HttpStatus.OK
            )
        } catch (error) {
            next(error);
        }
    }
}