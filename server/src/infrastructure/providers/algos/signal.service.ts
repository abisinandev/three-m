import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { ISignalService } from "@application/interfaces/services/algo-trading/signal.service.interface";
import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";

@injectable()
export class SignalService implements ISignalService {
    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
        @inject(NOTIFICATION_TYEPS.NotificationService) private readonly _notificationService: INotificationService,
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly _notificationRepository: INotificationRepository,
    ) { }

    async createSignal(input: {
        userId: string;
        symbol: string;
        algoId: string;
        action: SignalAction;
        strategyName: string;
        price: number;
        reason: string;
    }): Promise<any> {

        const exists = await this._signalRepository.existsRecentSignal(
            input.userId,
            input.symbol,
            input.strategyName
        );


        if (exists) {
            console.log("Duplicate signal skipped");
            return;
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const signal = AlgoSignalEntity.create({
            userId: input.userId,
            algoId: input.algoId,
            symbol: input.symbol,
            strategyName: input.strategyName,
            price: input.price,
            reason: input.reason,
            action: input.action,
            expiresAt,

        })
        await this._signalRepository.create(signal);

        const notification = NotificationEntity.create({
            userId: input.userId,
            type: NotificationType.ALGO_SIGNAL,
            title: 'Algo signal',
            message: input.action
        });

        const notfify = await this._notificationRepository.save(notification);

        await this._notificationService.send(
            input.userId,
            {
                id: notfify.id as string,
                type: NotificationType.ALGO_SIGNAL,
                title: 'Algo signal',
                message: input.reason,
                createdAt: new Date(notification.createdAt)
            }
        )
    }
}