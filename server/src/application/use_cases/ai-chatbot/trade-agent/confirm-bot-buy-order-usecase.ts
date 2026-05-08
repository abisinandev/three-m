import { inject, injectable } from "inversify";
import { ConfirmBotOrderDTO, IConfirmBotBuyOrderUseCase } from "../interface/confirm-bot-order-usecase.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { SuccessMessages } from "@shared/constants/success.messages";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderStatus } from "@domain/entities/stock/enum/order-status.enum";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { AssetType } from "@domain/entities/portfolio/enum/asset-type";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";

@injectable()
export class ConfirmBotBuyOrderUseCase implements IConfirmBotBuyOrderUseCase {

    constructor(
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
        @inject(AI_SYSTEM_TYPES.ChatHistoryService) private readonly _chatHistory: IChatHistoryService,
    ) { }

    async execute(order: ConfirmBotOrderDTO): Promise<void | { message: string, upgrade: boolean }> {

        const hasAccess = await this._featureAccess.hasAccess(
            order.userId,
            Features.STOCK_TRADING,
        );

        if (!hasAccess) {
            return {
                message: SuccessMessages.SUBSCRIPTION.UPGRADE_PREMIUM,
                upgrade: true
            };
        }

        const { userId, symbol, quantity } = order;

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // if (!isIndianMarketOpen())
            //     throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

            const user = await this._userRepository.findById(userId);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const stock = await this._stockRepository.findBySymbol(symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            if (!stock.isVisible)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_AVAILABLE);

            if (!stock.isTradable)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_TRADABLE);


            if (!quantity || quantity <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.QTY_VALIDATION);

            const latestQuote = await this._marketDataProvider.getLatestQuote(symbol);
            const marketPrice = latestQuote?.price ?? 0;

            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const totalValue = marketPrice * quantity;

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (wallet.availableBalance < totalValue) {
                throw new ValidationError(ErrorMessages.WALLET.INSUFFICIENT_BALANCE);
            }

            const transaction = TransactionEntity.create({
                userId,
                userCode: user.userCode,
                amount: totalValue,
                currency: CurrencyTypes.INR,
                referenceType: TransactionReferenceType.WALLET,
                status: TransactionStatus.PENDING,
                type: TransactionTypes.BUY
            });
            const newTransaction = await this._transactionRepository.createTransaction(transaction, session);

            wallet.debit(totalValue);
            await this._wallet.update(wallet.id as string, wallet, session);

            const marketOrder = OrderEntity.create({
                userId,
                symbol,
                side: OrderSide.BUY,
                orderType: OrderType.MARKET_ORDER,
                quantity: quantity,
                price: marketPrice,
                status: OrderStatus.FILLED,
                isAlgoTrade: false,
            });

            marketOrder.updateFilledQty(quantity, totalValue);
            marketOrder.markFilled();

            const newOrder = await this._orderRepository.create(marketOrder, session);

            const trade = TradeEntity.create({
                userId,
                orderId: newOrder.id as string,
                symbol,
                price: marketPrice,
                quantity: quantity,
                side: OrderSide.BUY,
                isAlgoTrade: false,
            });
            await this._tradeRepository.create(trade, session);

            let portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
                userId,
                stock.id as string,
                session
            );

            if (portfolio) {
                const newTotalQuantity = (portfolio.quantity ?? 0) + quantity;
                const newTotalInvested = portfolio.investedAmount + totalValue;
                const newAvgPrice = newTotalInvested / newTotalQuantity;

                portfolio.updateQuantityAndPrice(
                    newTotalQuantity,
                    newAvgPrice,
                    newTotalInvested
                );

                await this._portfolioRepository.update(
                    portfolio.id as string,
                    portfolio,
                    session
                );
            } else {
                portfolio = PortfolioEntity.create({
                    userId,
                    assetId: stock.id as string,
                    assetType: AssetType.STOCK,
                    quantity: quantity,
                    avgPrice: marketPrice,
                    investedAmount: totalValue,
                });

                await this._portfolioRepository.create(portfolio, session);
            }

            newTransaction.markSucess();
            await this._transactionRepository.updateStatus(newTransaction.id as string, TransactionStatus.SUCCESSFUL,session);

            await session.commitTransaction();

            await this._chatHistory.saveMessage(
                userId,
                'assistant',
                `Trade Executed: Successfully purchased **${quantity}** shares of **${symbol}** at **₹${marketPrice.toFixed(2)}**. Total: ₹${totalValue.toFixed(2)}.`
            );

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Chatbot buy order transaction failed");
        } finally {
            session.endSession();
        }
    }
}