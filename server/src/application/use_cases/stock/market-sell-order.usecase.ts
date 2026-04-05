import { inject, injectable } from "inversify";
import { IMarketSellOrderUseCase } from "./interfaces/market-sell-order-usecase.interface";
import { SellOrderDTO } from "@application/dto/stocks/SellOrderDTO";
import mongoose from "mongoose";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { isIndianMarketOpen } from "@shared/utils/market/market-time";
import { TradeEntity } from "@domain/entities/stock/trade.entity";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { OrderEntity } from "@domain/entities/stock/order.entity";

@injectable()
export class MarketSellOrderUseCase implements IMarketSellOrderUseCase {
    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
    ) { }

    async execute(data: SellOrderDTO, userId: string): Promise<void> {
        const session = await mongoose.startSession();

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

            const marketPrice = data.price// 📌📌 temp check ;
            if (!marketPrice || marketPrice <= 0)
                throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

            const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(userId, data.symbol, session);

            const availableQty = portfolio ? (portfolio.quantity - portfolio.lockQty) : 0;
            if (availableQty < data.quantity) {
                throw new ValidationError(`${ErrorMessages.PORTFOLIO.INSUFFICIENT_SHARES}: ${data.quantity}, Holding quantity: ${availableQty}`);
            }

            const requiredQty = data.quantity;
            portfolio!.lockQuantity(requiredQty);
            await this._portfolioRepository.update(userId, portfolio!, session);

            const requiredPrice = marketPrice;

            const totalProfitPrice = requiredPrice * data.quantity;

            const wallet = await this._wallet.findByUserId(userId, session);
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            wallet.credit(totalProfitPrice);
            await this._wallet.update(userId, wallet, session);

            portfolio!.unlockQuantity(requiredQty);
            const newQuantity = portfolio!.quantity - requiredQty;

            if (newQuantity === 0) {
                await this._portfolioRepository.deleteByUserIdAndSymbol(userId, data.symbol, session);
            } else {
                const costOfSharesSold = portfolio!.avgPrice * data.quantity;
                const newInvestedAmount = portfolio!.investedAmount - costOfSharesSold;

                portfolio!.updateQuantityAndPrice(newQuantity, portfolio!.avgPrice, newInvestedAmount);
                await this._portfolioRepository.update(
                    portfolio!.id as string,
                    portfolio!.toPersistence(),
                    session,
                );
            }

            const marketOrder = OrderEntity.create({
                userId,
                symbol: data.symbol,
                side: OrderSide.SELL,
                orderType: OrderType.MARKET_ORDER,
                quantity: data.quantity,
                price: data.price,
            });
            marketOrder.updateFilledQty(marketOrder.quantity, totalProfitPrice);
            const newOrder = await this._orderRepository.create(marketOrder, session);

            const trade = TradeEntity.create({
                userId,
                orderId: newOrder.id as string,
                symbol: data.symbol,
                price: totalProfitPrice,
                quantity: data.quantity,
                side: OrderSide.SELL,
            });
            await this._tradeRepository.create(trade, session);

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof AppError) throw error;
            if (error instanceof Error) throw new AppError(error.message);
            throw new AppError("Market sell order failed");

        } finally {
            session.endSession();
        }
    }
}