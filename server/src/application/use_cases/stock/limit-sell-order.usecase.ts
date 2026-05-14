import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { IStockValidationService } from "@application/services/stock/interfaces/stock-validation.service.interface";
import { LimitSellOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { ILimitSellOrderUseCase } from "./interfaces/limit-sell-order-usecase.interface";
import { ValidationError } from "@presentation/express/utils/error-handling";
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
export class LimitSellOrderUseCase implements ILimitSellOrderUseCase {

    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockValidationService) private readonly _stockValidationService: IStockValidationService,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(order: LimitSellOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {

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
                OrderSide.SELL,
                session
            );

            const limitOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.SELL,
                orderType: OrderType.LIMIT_ORDER,
                quantity: order.quantity,
                price: marketPrice,
                limitPrice: order.price,
                status: OrderStatus.PENDING,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });

            await this._orderRepository.create(limitOrder, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Limit sell order creation failed");
        } finally {
            session.endSession();
        }
    }
}
