import { inject, injectable } from "inversify";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { IExecuteLimitSellOrderUseCase } from "./interfaces/execute-limit-sell-order.interface";
import mongoose from "mongoose";
import { ICreateNotificationUseCase } from "../notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { logger } from "@infrastructure/providers/logger/pino.logger";

@injectable()
export class ExecuteLimitSellOrderUseCase implements IExecuteLimitSellOrderUseCase {
    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotification: ICreateNotificationUseCase,

    ) { }

    async execute(orderId: string): Promise<void> {

        const order = await this._orderRepository.findById(orderId);
        if (!order) return;
        if (order.status !== OrderStatus.PENDING) return;
        if (order.side !== OrderSide.SELL) return;

        const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
        const currentPrice = latestQuote?.price;

        const triggerPrice = order.limitPrice ?? order.price;
        if (!currentPrice || currentPrice < Number(triggerPrice)) {
            return;
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const user = await this._userRepository.findById(order.userId);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const stock = await this._stockRepository.findBySymbol(order.symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
                order.userId,
                stock.id as string,
                session
            );

            if (!portfolio || (portfolio.quantity ?? 0) < order.quantity) {
                order.markCancelled();
                await this._orderRepository.update(order.id as string, order, session);
                await session.commitTransaction();
                return;
            }

            const execution = {
                filledQty: order.quantity,
                avgPrice: currentPrice,
                totalValue: currentPrice * order.quantity,
                profit: (currentPrice - portfolio.avgPrice) * order.quantity,
            };

            const transaction = TransactionEntity.create({
                userId: order.userId,
                userCode: user.userCode,
                amount: execution.totalValue,
                currency: CurrencyTypes.INR,
                referenceType: TransactionReferenceType.WALLET,
                status: TransactionStatus.PENDING,
                type: TransactionTypes.SELL
            });
            const newTransaction = await this._transactionRepository.createTransaction(transaction, session);

            const wallet = await this._wallet.findByUserId(order.userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            wallet.credit(execution.totalValue);
            await this._wallet.update(wallet.id as string, wallet, session);


            order.updateFilledQty(execution.filledQty, execution.totalValue);
            order.markFilled();
            await this._orderRepository.update(order.id as string, order, session);

            const trade = TradeEntity.create({
                userId: order.userId,
                orderId: order.id as string,
                symbol: order.symbol,
                price: execution.avgPrice,
                quantity: execution.filledQty,
                side: OrderSide.SELL,
                profit: execution.profit,
                isAlgoTrade: order.isAlgoTrade ?? false,
            });
            await this._tradeRepository.create(trade, session);

            const newQuantity = (portfolio.quantity ?? 0) - execution.filledQty;

            if (newQuantity <= 0) {
                await this._portfolioRepository.deleteByUserIdAndSymbol(
                    order.userId,
                    stock.id as string,
                    session
                );
            } else {
                const costOfSharesSold = portfolio.avgPrice * execution.filledQty;
                const newInvestedAmount = portfolio.investedAmount - costOfSharesSold;

                portfolio.updateQuantityAndPrice(
                    newQuantity,
                    portfolio.avgPrice,
                    newInvestedAmount
                );

                if (order.stopLoss || order.takeProfit) {
                    portfolio.updateRiskLevels(order.stopLoss, order.takeProfit);
                }

                await this._portfolioRepository.update(
                    portfolio.id as string,
                    portfolio,
                    session
                );
            }

            newTransaction.markSucess();
            await this._transactionRepository.updateStatus(newTransaction.id as string, TransactionStatus.SUCCESSFUL, session);

            await this._createNotification.execute({
                userId: order.userId,
                type: NotificationType.INFO,
                title: "Limit Order Executed",
                message: `Your sell order for ${order.quantity} ${order.symbol} at Rs.${execution.totalValue} has been executed.`
            })

            await session.commitTransaction();
            logger.info(`[ExecuteLimitSellOrder] is completed`);
        } catch (error) {
            await session.abortTransaction();
            console.error(`Execution failed for sell order ${orderId}:`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
