// @deprecated - Replaced by ConfirmBuySignalUseCase and ConfirmSellSignalUseCase
// import { inject, injectable } from "inversify";
// import { IConfirmSignalUseCase } from "./interfaces/confirm-signal-usecase.interface";
// import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
// import { IMarketSellOrderUseCase } from "../stock/interfaces/market-sell-order-usecase.interface";
// import { IMarketBuyOrderUseCase } from "../stock/interfaces/buy-order-usecase.interface";
// import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";
// import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
// import AppError from "@presentation/express/utils/error-handling/app.error";
// import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
// import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
// import { SuccessMessages } from "@shared/constants/success.messages";

// @injectable()
// export class ConfirmSignalUseCase implements IConfirmSignalUseCase {
//     constructor(
//         @inject(STOCK_TYPES.MarketBuyOrderUseCase) private readonly _buyUseCase: IMarketBuyOrderUseCase,
//         @inject(STOCK_TYPES.MarketSellOrderUseCase) private readonly _sellUseCase: IMarketSellOrderUseCase,
//         @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
//     ) { }

//     async execute(data: ConfirmSignalDTO): Promise<void> {
//         const { action } = data;
//         const signal = await this._signalRepository.findById(data.signalId);
//         if (!signal) throw new NotFoundError(SuccessMessages.ALGO.SIGNAL_NOT_FOUND);
//         const now = new Date();
//         if (signal.expiresAt && new Date(signal.expiresAt) <= now) {
//             throw new ValidationError(
//                 `Signal has expired at ${new Date(signal.expiresAt).toLocaleTimeString()}. Please wait for a new signal.`
//             );
//         }
//         if (action === "BUY") {
//             await this._buyUseCase.execute({ symbol: data.symbol, quantity: data.quantity, stopLoss: data.stopLoss, takeProfit: data.takeProfit, orderType: OrderType.MARKET_ORDER }, data.userId);
//             return;
//         }
//         if (action === "SELL") {
//             await this._sellUseCase.execute({ symbol: data.symbol, quantity: data.quantity, orderType: OrderType.MARKET_ORDER }, data.userId);
//             return;
//         }
//         throw new AppError("Invalid signal action");
//     }
// }
