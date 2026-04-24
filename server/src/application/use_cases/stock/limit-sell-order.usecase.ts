import { inject, injectable } from "inversify";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import mongoose from "mongoose";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { LimitSellOrderDTO } from "@application/dto/stocks/limit-order.dto";
import { ILimitSellOrderUseCase } from "./interfaces/limit-sell-order-usecase.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class LimitSellOrderUseCase implements ILimitSellOrderUseCase {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(order: LimitSellOrderDTO, userId: string): Promise<void | { message: string, upgrade: boolean }> {
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

            // if (!isIndianMarketOpen())
            //     throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

            if (!order.quantity || order.quantity <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.QTY_VALIDATION);

            const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
            const marketPrice = latestQuote?.price ?? order.price;

            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
                userId,
                stock.id as string,
                session
            );
            
            if (!portfolio) throw new ValidationError(ErrorMessages.PORTFOLIO.NOT_HOLDING);

            const availableQty = portfolio.quantity ?? 0;
            if (availableQty < order.quantity) {
                throw new ValidationError(
                    `${ErrorMessages.PORTFOLIO.INSUFFICIENT_SHARES}: ${order.quantity}, Holding quantity: ${availableQty}`
                );
            }

            const limitOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.SELL,
                orderType: OrderType.LIMIT_ORDER,
                quantity: order.quantity,
                price: order.price,
                status: OrderStatus.PENDING,
                stopLoss: order.stopLoss,
                takeProfit: order.takeProfit,
                isAlgoTrade: order.isAlgoTrade ?? false,
            })
            await this._orderRepository.create(limitOrder, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new AppError("Limit sell order creation failed: " + (error as Error).message);
        } finally {
            session.endSession();
        }
    }
}
