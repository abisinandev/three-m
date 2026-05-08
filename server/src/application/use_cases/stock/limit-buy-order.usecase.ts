import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { ILimitBuyOrderUseCase } from "./interfaces/limit-buy-order-usecase.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";
import mongoose from "mongoose";

@injectable()
export class LimitBuyOrderUseCase implements ILimitBuyOrderUseCase {

    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,

    ) { }

    async execute(order: LimitBuyOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {

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

            const limitOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.LIMIT_ORDER,
                quantity: execution.filledQty,
                price: execution.avgPrice,
                limitPrice: order.price,
                status: OrderStatus.PENDING,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
                isAlgoTrade: order.isAlgoTrade ?? false,
            })

            wallet.debit(execution.totalValue);
            await this._wallet.update(wallet.id as string, wallet, session);

            await this._orderRepository.create(limitOrder, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new AppError("Limit order execution failed");
        } finally {
            session.endSession();
        }
    }
}