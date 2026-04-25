import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { ISignalService } from "@application/interfaces/services/algo-trading/signal.service.interface";
import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { SignalAction } from "@domain/entities/algo/enum/signal-enums";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { inject, injectable } from "inversify";
import { ISignalManager } from "@application/interfaces/repositories/algo/signal-manager.interface";
import { ICreateNotificationUseCase } from "@application/use_cases/notification/interfaces/create-notification-usecase.interface";

@injectable()
export class SignalService implements ISignalService {
    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
        @inject(NOTIFICATION_TYEPS.NotificationService) private readonly _createNotification: ICreateNotificationUseCase,
        @inject(STOCK_TYPES.SignalManager) private readonly _signalManager: ISignalManager,
    ) { }

    async processSignal(input: {
        userId: string;
        symbol: string;
        algoId: string;
        action: SignalAction;
        strategyName: string;
        price: number;
        reason: string;
    }): Promise<void> {

        const shouldEmit = await this._signalManager.shouldEmitSignal(
            input.algoId,
            input.symbol,
            input.action
        );

        if (!shouldEmit) {
            console.log(`[SignalService] Duplicate signal suppressed via SignalManager for ${input.symbol}`);
            return;
        }

        const exists = await this._signalRepository.existsRecentSignal(
            input.userId,
            input.symbol,
            input.algoId,
            input.action
        );

        if (exists) {
            console.log(`[SignalService] Duplicate signal skipped (DB cooldown check) for ${input.symbol}`);
            return;
        }

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const signal = AlgoSignalEntity.create({
            userId: input.userId,
            symbol: input.symbol,
            strategyName: input.strategyName,
            price: input.price,
            reason: input.reason,
            action: input.action,
            expiresAt,
        });

        await this._signalRepository.create(signal);

        const message = `${input.action} signal for ${input.symbol}: ${input.reason}`;
        this._createNotification.execute({
            userId: input.userId,
            type: NotificationType.ALGO_SIGNAL,
            title: 'Algo signal',
            message: message,
        });
    }

    async createSignal(input: any): Promise<void> {
        await this.processSignal(input);
    }
}