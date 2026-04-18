import { inject, injectable } from "inversify";
import { IConfirmBuySignalUseCase } from "./interfaces/confirm-buy-signal.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketBuyOrderUseCase } from "../stock/interfaces/buy-order-usecase.interface";
import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { SuccessMessages } from "@shared/constants/success.messages";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";

@injectable()
export class ConfirmBuySignalUseCase implements IConfirmBuySignalUseCase {
    constructor(
        @inject(STOCK_TYPES.MarketBuyOrderUseCase) private readonly _buyUseCase: IMarketBuyOrderUseCase,
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(data: ConfirmSignalDTO): Promise<void> {

        const signal = await this._signalRepository.findById(data.signalId);
        if (!signal) throw new NotFoundError(SuccessMessages.ALGO.SIGNAL_NOT_FOUND);

        const now = new Date();
        if (signal.expiresAt && new Date(signal.expiresAt) <= now) {
            throw new ValidationError(
                `Signal has expired at ${new Date(signal.expiresAt).toLocaleTimeString()}. Please wait for a new signal.`
            );
        }

        await this._buyUseCase.execute(
            {
                symbol: data.symbol,
                quantity: data.quantity,
                stopLoss: data.stopLoss,
                takeProfit: data.takeProfit,
                orderType: OrderType.MARKET_ORDER,
                isAlgoTrade: true,
            },
            data.userId
        );
    }
}
