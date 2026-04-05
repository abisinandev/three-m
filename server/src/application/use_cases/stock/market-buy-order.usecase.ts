import { inject, injectable } from "inversify";
import { IMarketBuyOrderUseCase } from "./interfaces/buy-order-usecase.interface";
import { BuyOrderDTO } from "@application/dto/stocks/BuyOrderDTO";
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
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { PortfolioEntity } from "@domain/entities/portfolio/portfolio.entity";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";

@injectable()
export class MarketBuyOrderUseCase implements IMarketBuyOrderUseCase {

    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
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

            const marketPrice = data.price// 📌📌 this should be latest price. so update;
            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const requiredPrice = marketPrice * data.quantity * 1.01;

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (wallet.availableBalance < requiredPrice)
                throw new ValidationError(ErrorMessages.WALLET.INSUFFICIENT_BALANCE);


            wallet.lock(requiredPrice);
            await this._wallet.update(userId, wallet, session);

            const executionPrice = data.price;// 📌📌 this should be latest price. so update;
            if (!executionPrice || executionPrice <= 0)
                throw new ValidationError("Invalid execution price");

            const actualCost = executionPrice * data.quantity;

            wallet.unlock(requiredPrice);
            wallet.debit(actualCost);

            if (requiredPrice > actualCost) {
                const refund = requiredPrice - actualCost;
                wallet.credit(refund);// adding buffered amount
            }

            await this._wallet.update(userId, wallet, session);

            // 1. update portfolio
            let portfolio = await this._portfolioRepository.findByUserIdAndSymbol(userId, data.symbol, session);

            if (portfolio) {
                const newTotalQuantity = portfolio.quantity + data.quantity;
                const newTotalInvested = portfolio.investedAmount + actualCost;
                const newAvgPrice = newTotalInvested / newTotalQuantity;

                portfolio.updateQuantityAndPrice(newTotalQuantity, newAvgPrice, newTotalInvested);

                await this._portfolioRepository.update(portfolio.id as string, portfolio, session);
            } else {
                portfolio = PortfolioEntity.create({
                    userId,
                    symbol: data.symbol,
                    quantity: data.quantity,
                    avgPrice: executionPrice,
                    investedAmount: actualCost
                });
                await this._portfolioRepository.create(portfolio, session);
            }

            //create order
            const marketOrder = OrderEntity.create({
                userId,
                symbol: data.symbol,
                side: OrderSide.BUY,
                orderType: OrderType.MARKET_ORDER,
                quantity: data.quantity,
                price: data.price,
            })

            marketOrder.updateFilledQty(marketOrder.quantity, marketOrder.price as number);
            const newOrder = await this._orderRepository.create(marketOrder, session);

            //2. create trade repository;
            const trade = TradeEntity.create({
                userId,
                orderId: newOrder.id as string,
                symbol: data.symbol,
                price: executionPrice,
                quantity: data.quantity,
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