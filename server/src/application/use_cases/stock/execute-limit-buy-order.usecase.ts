import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { ICreateNotificationUseCase } from "../notification/interfaces/create-notification-usecase.interface";
import { ITransactionService } from "@application/services/transaction/interfaces/transaction.service.interface";
import { IWalletService } from "@application/services/wallet/interfaces/wallet.service.interface";
import { IPortfolioService } from "@application/services/portfolio/interfaces/portfolio.service.interface";
import { IExecuteLimitBuyOrderUseCase } from "./interfaces/execute-limit-buy-order.interface";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import mongoose from "mongoose";

@injectable()
export class ExecuteLimitBuyOrderUseCase implements IExecuteLimitBuyOrderUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotification: ICreateNotificationUseCase,
        @inject(USER_TYPES.TransactionService) private readonly _transactionService: ITransactionService,
        @inject(USER_TYPES.WalletService) private readonly _walletService: IWalletService,
        @inject(PORTFOLIO_TYPES.PortfolioService) private readonly _portfolioService: IPortfolioService,
    ) { }

    async execute(orderId: string): Promise<void> {

        const order = await this._orderRepository.findById(orderId);
        if (!order) return;
        if (order.status !== OrderStatus.PENDING) return;
        if (order.side !== OrderSide.BUY) return;

        const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
        const currentPrice = latestQuote?.price;

        const triggerPrice = order.limitPrice ?? order.price;
        if (!currentPrice || currentPrice > Number(triggerPrice)) {
            return;
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const user = await this._userRepository.findById(order.userId);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const execution = {
                filledQty: order.quantity,
                avgPrice: currentPrice,
                totalValue: currentPrice * order.quantity,
            };

            const reservedValue = order.price * order.quantity;
            const refundAmount = reservedValue - execution.totalValue;

            const newTransaction = await this._transactionService.createStockTransaction(
                user,
                execution.totalValue,
                TransactionTypes.BUY,
                order.id as string,
                session
            );

            const wallet = await this._walletRepository.findOne({ userId: order.userId as string });
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (refundAmount > 0) {
                await this._walletService.credit(wallet, refundAmount, session);
            } else if (refundAmount < 0) {
                await this._walletService.debit(wallet, Math.abs(refundAmount), session);
            }

            order.updateFilledQty(execution.filledQty, execution.avgPrice);
            order.markFilled();
            await this._orderRepository.update(order.id as string, order, session);

            const trade = TradeEntity.create({
                userId: order.userId,
                orderId: order.id as string,
                symbol: order.symbol,
                price: execution.avgPrice,
                quantity: execution.filledQty,
                side: OrderSide.BUY,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });
            await this._tradeRepository.create(trade, session);

            const stock = await this._stockRepository.findBySymbol(order.symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            await this._portfolioService.updateOrCreatePortfolio(
                order.userId,
                stock.id as string,
                AssetType.STOCK,
                execution.totalValue,
                execution.avgPrice,
                session
            );

            await this._transactionService.markSuccess(newTransaction, session);

            await this._createNotification.execute({
                userId: order.userId,
                type: NotificationType.INFO,
                title: "Limit Order Executed",
                message: `Your buy order for ${order.quantity} ${order.symbol} at Rs.${execution.avgPrice.toFixed(2)} has been executed.`
            });

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            console.error(`[ExecuteLimitBuyOrder] Failed for order ${orderId}:`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
