import { inject, injectable } from "inversify";
import { IProcessSignalUseCase, ProcessSignalDTO } from "./interfaces/process-signal.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { INotificationRepository } from "@application/interfaces/repositories/feature/notification-repository.interface";
import { INotificationService } from "@application/interfaces/services/notification/notification-service.interface";
import { AlgoSignalEntity } from "@domain/entities/algo/algo-signal.entity";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";

@injectable()
export class ProcessSignalUseCase implements IProcessSignalUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
        @inject(NOTIFICATION_TYEPS.NotificationRepository) private readonly _notificationRepository: INotificationRepository,
        @inject(NOTIFICATION_TYEPS.NotificationService) private readonly _notificationService: INotificationService,
        @inject(STOCK_TYPES.AlgoStrategyConfigRepository) private readonly _riskConfigRepository: IAlgoStrategyConfigRepository,
    ) { }

    async execute(input: ProcessSignalDTO): Promise<void> {

        const {
            userId,
            // algoId,
            symbol,
            action
        } = input;

        const lastAction = await this._signalRepository.getLastSignalAction(
            userId, 
            // algoId,
            symbol
        );

        if (action === null || lastAction === action) {
            console.log(`[ProcessSignalUseCase] Signal (Duplicate/Non-crossover) for ${input.symbol}`);
            return;
        }

        const exists = await this._signalRepository.existsRecentSignal(
            input.userId,
            input.symbol,
            // input.algoId,
            input.action,
            5
        );

        if (exists) {
            console.log(`[ProcessSignalUseCase] Duplicate signal skipped (5-min cooldown) for ${input.symbol}`);
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

        const createdSignal = await this._signalRepository.createSignal(signal);

        await this._handleNotification(input, createdSignal);
    }

    private async _handleNotification(input: ProcessSignalDTO, signal: AlgoSignalEntity): Promise<void> {
        const riskConfig = await this._riskConfigRepository.findByStrategyName(input.strategyName);

        let riskDetails = "";
        if (riskConfig) {
            riskDetails = ` [Risk: ₹${riskConfig.riskAmount}, SL: ₹${riskConfig.stopLoss}, TP: ₹${riskConfig.takeProfit}]`;
        }

        const message = `${input.action} signal for ${input.symbol}: ${input.reason}.${riskDetails}`;

        const notification = NotificationEntity.create({
            userId: input.userId,
            type: NotificationType.ALGO_SIGNAL,
            title: 'Algo signal',
            message: message,
            data: {
                signalId: signal.id as string,
                symbol: input.symbol,
                action: input.action,
                price: input.price
            }
        });

        const savedNotification = await this._notificationRepository.save(notification);
        const payload = savedNotification.toJSON();

        const notificationId = savedNotification.id || payload.id || "";

        this._notificationService.send(input.userId, {
            ...payload,
            id: notificationId,
            createdAt: new Date(payload.createdAt),
            data: payload.data || {}
        });

    }
}
