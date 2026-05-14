import { inject, injectable } from "inversify";
import { IStockValidationService } from "./interfaces/stock-validation.service.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { OrderSide } from "@domain/entities/stock/enum/order-side.enum";
import { UserEntity } from "@domain/entities/user/user.entity";
import { StockEntity } from "@domain/entities/stock/stock.entity";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { ClientSession } from "mongoose";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class StockValidationService implements IStockValidationService {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async validateMarketOrder(
        userId: string,
        symbol: string,
        quantity: number,
        side: OrderSide,
        session?: ClientSession
    ): Promise<{ 
        user: UserEntity; 
        stock: StockEntity; 
        wallet: WalletEntity; 
        marketPrice: number;
    }> {
        const user = await this._userRepository.findById(userId, session);
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
        const marketPrice = latestQuote?.price;

        if (!marketPrice || marketPrice <= 0)
            throw new ValidationError(ErrorMessages.STOCKS.INVALID_MARKET_PRICE);

        const wallet = await this._walletRepository.findByUserId(userId, session);
        if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

        const totalValue = marketPrice * quantity;

        if (side === OrderSide.BUY) {
            if (wallet.availableBalance < totalValue)
                throw new ValidationError(ErrorMessages.WALLET.INSUFFICIENT_BALANCE);
        } else if (side === OrderSide.SELL) {
            const portfolio = await this._portfolioRepository.findByUserIdAndSymbol(
                userId,
                stock.id as string,
                session
            );
            if (!portfolio) throw new ValidationError(ErrorMessages.PORTFOLIO.NOT_HOLDING);

            const availableQty = portfolio.quantity ?? 0;
            if (availableQty < quantity) {
                throw new ValidationError(
                    `${ErrorMessages.PORTFOLIO.INSUFFICIENT_SHARES}: ${quantity}, Holding quantity: ${availableQty}`
                );
            }
        }

        return { user, stock, wallet, marketPrice };
    }
}
