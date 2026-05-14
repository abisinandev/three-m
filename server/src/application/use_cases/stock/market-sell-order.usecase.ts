import { inject, injectable } from "inversify";
import { IMarketSellOrderUseCase } from "./interfaces/market-sell-order-usecase.interface";
import { SellOrderDTO } from "@application/dto/stocks/sell-order.dto";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { IOrderQueue } from "@application/interfaces/services/stocks/order-queue.interface";
import { IStockValidationService } from "@application/services/stock/interfaces/stock-validation.service.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { SuccessMessages } from "@shared/constants/success.messages";
import { ValidationError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import mongoose from "mongoose";

@injectable()
export class MarketSellOrderUseCase implements IMarketSellOrderUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockValidationService) private readonly _stockValidationService: IStockValidationService,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(STOCK_TYPES.OrderQueue) private readonly _orderQueue: IOrderQueue,
    ) { }

    async execute(order: SellOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(
            userId,
            Features.STOCK_TRADING
        );

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

            const marketOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.SELL,
                orderType: OrderType.MARKET_ORDER,
                quantity: order.quantity,
                price: marketPrice,
                status: OrderStatus.PENDING,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });

            const newOrder = await this._orderRepository.create(marketOrder, session);

            await session.commitTransaction();

            await this._orderQueue.addMarketOrderJob(newOrder.id as string);

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Market sell order request failed");
        } finally {
            session.endSession();
        }
    }
}
