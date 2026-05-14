import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { IStockValidationService } from "@application/services/stock/interfaces/stock-validation.service.interface";
import { IWalletService } from "@application/services/wallet/interfaces/wallet.service.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { ILimitBuyOrderUseCase } from "./interfaces/limit-buy-order-usecase.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SuccessMessages } from "@shared/constants/success.messages";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import AppError from "@presentation/express/utils/error-handling/app.error";
import mongoose from "mongoose";

@injectable()
export class LimitBuyOrderUseCase implements ILimitBuyOrderUseCase {

    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockValidationService) private readonly _stockValidationService: IStockValidationService,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(USER_TYPES.WalletService) private readonly _walletService: IWalletService,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(order: LimitBuyOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(userId, Features.STOCK_TRADING);

        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        if (!isIndianMarketOpen())
            throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const { marketPrice } = await this._stockValidationService.validateMarketOrder(
                userId,
                order.symbol,
                order.quantity,
                OrderSide.BUY,
                session
            );

            const limitOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.LIMIT_ORDER,
                quantity: order.quantity,
                price: marketPrice,
                limitPrice: order.price,
                status: OrderStatus.PENDING,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });

            const wallet = await this._walletRepository.findOne({ userId });
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            await this._walletService.debit(wallet, marketPrice * order.quantity, session);

            await this._orderRepository.create(limitOrder, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Limit buy order creation failed");
        } finally {
            session.endSession();
        }
    }
}