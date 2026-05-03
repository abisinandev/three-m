import { HttpStatus } from "@domain/enum/express/status-code";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { SuccessMessages } from "@shared/constants/success.messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IGetNotificationsUseCase } from "@application/use_cases/notification/interfaces/get-notifications.usecase.interface";
import { IMarkAllReadUseCase } from "@application/use_cases/notification/interfaces/mark-all-read.usecase.interface";
import { IMarkAsReadUseCase } from "@application/use_cases/notification/interfaces/mark-as-read.usecase.interface";

@injectable()
export class NotificationController {
    constructor(
        @inject(NOTIFICATION_TYEPS.GetNotificationsUseCase) private readonly _getNotifications: IGetNotificationsUseCase,
        @inject(NOTIFICATION_TYEPS.MarkAllReadUseCase) private readonly _markAllRead: IMarkAllReadUseCase,
        @inject(NOTIFICATION_TYEPS.MarkAsReadUseCase) private readonly _markAsRead: IMarkAsReadUseCase
    ) { }

    async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id as string;
            const unreadOnly = req.query.filter === 'unread';
            
            const notifications = await this._getNotifications.execute(userId, unreadOnly);
            
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
            await this._markAllRead.execute(userId);
            
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

            await this._markAsRead.execute(id as string, userId);
            
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