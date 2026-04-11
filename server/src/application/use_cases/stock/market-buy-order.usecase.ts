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
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import mongoose from "mongoose";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";

@injectable()
export class MarketBuyOrderUseCase implements IMarketBuyOrderUseCase {

    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async execute(data: BuyOrderDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession()

        try {
            session.startTransaction();

            const user = await this._userRepository.findById(userId);
            if (!user) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);

            const stock = await this._stockRepository.findBySymbol(data.symbol);
            if (!stock) throw new NotFoundError(ErrorMessages.STOCKS.NOT_FOUND);

            if (!stock.isVisible)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_AVAILABLE);

            if (!stock.isTradable)
                throw new ValidationError(ErrorMessages.STOCKS.STOCK_NOT_TRADABLE);

            // if (!isIndianMarketOpen())
            //     throw new ValidationError(ErrorMessages.STOCKS.MARKET_CLOSED);

            if (!data.quantity || data.quantity <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.QTY_VALIDATION);

            const latestQuote = await this._marketDataProvider.getLatestQuote(data.symbol);
            const marketPrice = latestQuote?.price ?? data.price;

            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const execution = {
                filledQty: data.quantity,
                avgPrice: marketPrice,
                totalValue: marketPrice * data.quantity,
            };

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (wallet.availableBalance < execution.totalValue)
                throw new ValidationError(ErrorMessages.WALLET.INSUFFICIENT_BALANCE);

            wallet.debit(execution.totalValue);
            await this._wallet.update(userId, wallet, session);

            let portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
                userId,
                data.symbol,
                session
            );

            if (portfolio) {
                const newTotalQuantity = portfolio.quantity + execution.filledQty;
                const newTotalInvested = portfolio.investedAmount + execution.totalValue;
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
                    symbol: data.symbol,
                    quantity: execution.filledQty,
                    avgPrice: execution.avgPrice,
                    investedAmount: execution.totalValue,
                });
                await this._portfolioRepository.create(portfolio, session);
            }

            if (data.stopLoss || data.takeProfit) {
                portfolio.updateRiskLevels(data.stopLoss, data.takeProfit);
                await this._portfolioRepository.update(
                    portfolio.id as string,
                    portfolio,
                    session
                );
            }


            const marketOrder = OrderEntity.create({
                userId,
                symbol: data.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.MARKET_ORDER,
                quantity: execution.filledQty,
                price: execution.avgPrice,
                stopLoss: data.stopLoss,
                takeProfit: data.takeProfit,
            })

            marketOrder.updateFilledQty(
                execution.filledQty,
                execution.totalValue
            );
            marketOrder.markFilled();

            const newOrder = await this._orderRepository.create(
                marketOrder,
                session
            );

            const trade = TradeEntity.create({
                userId,
                orderId: newOrder.id as string,
                symbol: data.symbol,
                price: execution.avgPrice,
                quantity: execution.filledQty,
                side: OrderSide.BUY,
            })
            await this._tradeRepository.create(trade, session);

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError || error instanceof Error) throw error;
            throw new AppError("Buy order transaction failed");
        } finally {
            session.endSession();
        }

    }
}  