import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { ICancelLimitOrderUseCase } from "./interfaces/cancel-limit-order-usecase.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import mongoose from "mongoose";

@injectable()
export class CancelLimitOrderUseCase implements ICancelLimitOrderUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
    ) { }

    async execute(orderId: string, userId: string): Promise<void> {
        const order = await this._orderRepository.findById(orderId);

        if (!order) throw new NotFoundError(ErrorMessages.ORDER.NOT_FOUND);

        if (order.userId !== userId) {
            throw new ValidationError(ErrorMessages.ORDER.UNAUTHORIZED);
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ValidationError(ErrorMessages.ORDER.CANNOT_CANCEL);
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            order.markCancelled();
            await this._orderRepository.update(orderId, order, session);

            if (order.side === OrderSide.BUY) {
                const reservedAmount = order.price * order.quantity;
                const wallet = await this._wallet.findByUserId(userId, session);
                if (wallet) {
                    wallet.credit(reservedAmount);
                    await this._wallet.update(userId, wallet, session);
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
