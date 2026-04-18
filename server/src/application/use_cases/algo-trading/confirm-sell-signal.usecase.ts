import { inject, injectable } from "inversify";
import { IConfirmSellSignalUseCase } from "./interfaces/confirm-sell-signal.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IMarketSellOrderUseCase } from "../stock/interfaces/market-sell-order-usecase.interface";
import { ConfirmSignalDTO } from "@application/dto/algo-trading/confirm-signal.dto";
import { OrderType } from "@domain/entities/stock/enum/order-type.enum";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { SuccessMessages } from "@shared/constants/success.messages";

@injectable()
export class ConfirmSellSignalUseCase implements IConfirmSellSignalUseCase {
    constructor(
        @inject(STOCK_TYPES.MarketSellOrderUseCase) private readonly _sellUseCase: IMarketSellOrderUseCase,
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _signalRepository: IAlgoSignalRepository,
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

        await this._sellUseCase.execute(
            {
                symbol: data.symbol,
                quantity: data.quantity,
                orderType: OrderType.MARKET_ORDER,
                isAlgoTrade: true,
            },
            data.userId
        );
    }
}
