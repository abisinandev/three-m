import { inject, injectable } from "inversify";
import { IConfirmSellSignalUseCase } from "./interfaces/confirm-sell-signal.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import mongoose from "mongoose";
import { ErrorMessages } from "@shared/constants/error.messages";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import { ICreateNotificationUseCase } from "../notification/interfaces/create-notification-usecase.interface";
import { NotificationType } from "@domain/entities/notification/enums/notification-type.enums";
import { SignalStatus } from "@domain/entities/algo/enum/signal-enums";
import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";

@injectable()
export class ConfirmSellSignalUseCase implements IConfirmSellSignalUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(NOTIFICATION_TYEPS.CreateNotificationUseCase) private readonly _createNotification: ICreateNotificationUseCase,
        @inject(STOCK_TYPES.AlgoStrategyConfigRepository) private readonly _riskConfigRepository: IAlgoStrategyConfigRepository,

    ) { }

    async execute(order: ConfirmSignalDTO): Promise<void> {
        const { userId } = order;
        const signal = await this._signalRepository.findById(order.signalId);
        if (!signal) throw new NotFoundError(SuccessMessages.ALGO.SIGNAL_NOT_FOUND);

        if (signal.status !== SignalStatus.PENDING) {
            throw new ValidationError("This signal has already been processed.");
        }

        // Risk Validation
        const riskConfig = await this._riskConfigRepository.findByStrategyName(signal.strategyName);
        if (riskConfig) {
            // 1. Check Daily Trade Limit
            const dailyTrades = await this._signalRepository.countApprovedDailySignalsByStrategy(signal.strategyName);
            if (dailyTrades >= riskConfig.maxTradesPerDay) {
                throw new ValidationError(`Risk Limit Reached: ${signal.strategyName} has reached its daily limit of ${riskConfig.maxTradesPerDay} trades.`);
            }
        }

        const now = new Date();
        if (signal.expiresAt && new Date(signal.expiresAt) <= now) {
            throw new ValidationError(
                `Signal has expired at ${new Date(signal.expiresAt).toLocaleTimeString()}. Please wait for a new signal.`
            );
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

            // if (!stock.isTradable)
            //     throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_TRADABLE);

            // if (!isIndianMarketOpen())
            //     throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

            if (!order.quantity || order.quantity <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.QTY_VALIDATION);

            const latestQuote = await this._marketDataProvider.getLatestQuote(order.symbol);
            const marketPrice = latestQuote?.price ?? 0;

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

                await this._createNotification.execute({
                    userId,
                    title: "Algo trading execution",
                    message: `${ErrorMessages.PORTFOLIO.INSUFFICIENT_SHARES}: ${order.quantity}, Holding quantity: ${availableQty}`,
                    type: NotificationType.WARNING,
                })

                await session.abortTransaction();
                return
            }

            const execution = {
                filledQty: order.quantity,
                avgPrice: marketPrice,
                totalValue: marketPrice * order.quantity,
                profit: (marketPrice - portfolio.avgPrice) * order.quantity,
            };

            const transaction = TransactionEntity.create({
                userId,
                userCode: user.userCode,
                amount: execution.totalValue,
                currency: CurrencyTypes.INR,
                referenceType: TransactionReferenceType.WALLET,
                status: TransactionStatus.PENDING,
                type: TransactionTypes.SELL
            })
            const newTransaction = await this._transactionRepository.createTransaction(transaction, session);

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);
            wallet.credit(execution.totalValue);
            await this._wallet.update(wallet.id as string, wallet, session);

            const marketOrder = OrderEntity.create({
                userId,
                symbol: order.symbol,
                side: OrderSide.SELL,
                orderType: OrderType.MARKET_ORDER,
                quantity: execution.filledQty,
                price: marketPrice,
                status: OrderStatus.FILLED,
                isAlgoTrade: true,
            });

            marketOrder.updateFilledQty(execution.filledQty, execution.totalValue);
            marketOrder.markFilled();

            const newOrder = await this._orderRepository.create(marketOrder, session);

            const trade = TradeEntity.create({
                userId,
                orderId: newOrder.id as string,
                symbol: order.symbol,
                price: execution.avgPrice,
                quantity: execution.filledQty,
                side: OrderSide.SELL,
                profit: execution.profit,
                isAlgoTrade: true,
            });
            await this._tradeRepository.create(trade, session);

            const newQuantity = (portfolio.quantity ?? 0) - execution.filledQty;

            if (newQuantity <= 0) {
                await this._portfolioRepository.deleteByUserIdAndSymbol(
                    userId,
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


                await this._portfolioRepository.update(
                    portfolio.id as string,
                    portfolio,
                    session
                );
            }

            newTransaction.markSucess();
            await this._transactionRepository.update(newTransaction.id as string, newTransaction, session);

            signal.approve();
            await this._signalRepository.update(signal.id as string, signal, session);

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Market sell order failed");
        } finally {
            session.endSession();
        }

    }
}
