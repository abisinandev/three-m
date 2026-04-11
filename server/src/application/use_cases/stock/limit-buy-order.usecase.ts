// import { inject, injectable } from "inversify";
// import { ILimitBuyOrderUseCase } from "./interfaces/limit-buy-order-usecase.interface";
// import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
// import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
// import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
// import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
// import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
// import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
// import { IOrderRepository } from "@application/interfaces/repositories/stock/order-repository.interface";
// import { ITradeRepository } from "@application/interfaces/repositories/stock/trade-repository.interface";
// import { IPortfolioRepository } from "@application/interfaces/repositories/feature/portfolio-repository.interface";
// import mongoose from "mongoose";
// import AppError from "@presentation/express/utils/error-handling/app.error";
// import { LimitBuyOrderDTO } from "@application/dto/stocks/limit-order.dto";

// @injectable()
// export class LimitBuyOrderUseCase implements ILimitBuyOrderUseCase {

//     constructor(
//         @inject(USER_TYPES.WalletRepository) private readonly _wallet: IWalletRepository,
//         @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
//         @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
//         @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
//         @inject(STOCK_TYPES.TradeRepository) private readonly _tradeRepository: ITradeRepository,
//         @inject(PORTFOLIO_TYPES.PortfolioRepository) private readonly _portfolioRepository: IPortfolioRepository,
//     ) { }

//     async execute(order: LimitBuyOrderDTO): Promise<void> {
//         const session = await mongoose.startSession();
//         try {
//             session.startTransaction();


//         } catch (error) {
//             await session.abortTransaction();
//             throw new AppError("Limit order execution failed");
//         } finally {
//             session.endSession();
//         }
//     }
// }