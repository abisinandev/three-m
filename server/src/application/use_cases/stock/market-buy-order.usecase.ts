import { inject, injectable } from "inversify";
import { IMarketBuyOrderUseCase } from "./interfaces/buy-order-usecase.interface";
import { BuyOrderDTO } from "@application/dto/stocks/buy-order.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import AppError from "@presentation/express/utils/error-handling/app.error";
import mongoose from "mongoose";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { IOrderQueue } from "@application/interfaces/services/stocks/order-queue.interface";

@injectable()
export class MarketBuyOrderUseCase implements IMarketBuyOrderUseCase {

    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
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

            const user = await this._userRepository.findById(userId);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const stock = await this._stockRepository.findBySymbol(order.symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            if (!stock.isVisible)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_AVAILABLE);

            if (!stock.isTradable)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_TRADABLE);

            if (!order.quantity || order.quantity <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.QTY_VALIDATION);

            const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
            const marketPrice = latestQuote?.price ?? order.price;

            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const execution = {
                filledQty: order.quantity,
                avgPrice: marketPrice,
                totalValue: marketPrice * order.quantity,
            };

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (wallet.availableBalance < execution.totalValue)
                throw new ValidationError(ErrorMessages.WALLET.INSUFFICIENT_BALANCE);

            const marketOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.MARKET_ORDER,
                quantity: execution.filledQty,
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
  