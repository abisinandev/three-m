import { inject, injectable } from "inversify";
import { IAdminUpdateStrategyRiskConfigUseCase } from "./interfaces/admin-base-strategy-risk.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";
import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";
import { UpdateStrategyRiskDTO } from "@application/dto/admin/algo-trading/strategy-risk.dto";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class AdminUpdateStrategyRiskConfigUseCase implements IAdminUpdateStrategyRiskConfigUseCase {

    private RISK_AMOUNT = 1000;
    private MAX_TRADES = 5;
    private STOPLOSS = 100;
    private TAKEPROFIT = 200;

    constructor(
        @inject(STOCK_TYPES.AlgoStrategyConfigRepository) private readonly _configRepository: IAlgoStrategyConfigRepository,
    ) { }

    async execute(data: UpdateStrategyRiskDTO): Promise<AlgoStrategyRiskConfig> {

        if (!data.maxTradesPerDay || data.maxTradesPerDay > this.MAX_TRADES) {
            throw new ValidationError(ErrorMessages.STRATEGY.MAX_TRADES);
        }

        if (!data.riskAmount || data.riskAmount > this.RISK_AMOUNT) {
            throw new ValidationError(ErrorMessages.STRATEGY.RISK_AMOUNT);
        }

        if (!data.stopLoss || data.stopLoss > this.STOPLOSS) {
            throw new ValidationError(ErrorMessages.STRATEGY.STOP_LOSS);
        }

        if (!data.takeProfit || data.takeProfit > this.TAKEPROFIT) {
            throw new ValidationError(ErrorMessages.STRATEGY.TAKE_PROFIT);
        }

        const config = AlgoStrategyRiskConfig.create({
            strategyName: data.strategyName,
            riskAmount: data.riskAmount,
            maxTradesPerDay: data.maxTradesPerDay,
            stopLoss: data.stopLoss,
            takeProfit: data.takeProfit,
        });

        return await this._configRepository.save(config);
    }
}
