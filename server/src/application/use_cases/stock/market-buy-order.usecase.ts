import { inject, injectable } from "inversify";
import { IMarketBuyOrderUseCase } from "./interfaces/buy-order-usecase.interface";
import { BuyOrderDTO } from "@application/dto/stocks/buy-order.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import AppError from "@presentation/express/utils/error-handling/app.error";
import mongoose from "mongoose";
import { IStockValidationService } from "@application/services/stock/interfaces/stock-validation.service.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";

import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { IOrderQueue } from "@application/interfaces/services/stocks/order-queue.interface";

@injectable()
export class MarketBuyOrderUseCase implements IMarketBuyOrderUseCase {

    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockValidationService) private readonly _stockValidationService: IStockValidationService,

        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(STOCK_TYPES.OrderQueue) private readonly _orderQueue: IOrderQueue,
    ) { }

    async execute(order: BuyOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(
            userId,
            Features.STOCK_TRADING,
        );

        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        if (!isIndianMarketOpen())
            throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

        const session = await mongoose.startSession()

        try {
            session.startTransaction();

            const { marketPrice } = await this._stockValidationService.validateMarketOrder(
                userId,
                order.symbol,
                order.quantity,
                OrderSide.BUY,
                session
            );


            const marketOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.MARKET_ORDER,
                quantity: order.quantity,
                price: marketPrice,
                status: OrderStatus.PENDING,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });

            const newOrder = await this._orderRepository.create(marketOrder, session);

            await session.commitTransaction();

            await this._orderQueue.addMarketOrderJob(newOrder.id as string);

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Buy order request failed");
        } finally {
            session.endSession();
        }
    }
}
  