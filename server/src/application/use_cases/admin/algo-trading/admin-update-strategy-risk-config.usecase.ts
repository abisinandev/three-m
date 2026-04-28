import { inject, injectable } from "inversify";
import { IAdminUpdateStrategyRiskConfigUseCase, UpdateStrategyRiskDTO } from "./interfaces/admin-base-strategy-risk.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";
import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";

@injectable()
export class AdminUpdateStrategyRiskConfigUseCase implements IAdminUpdateStrategyRiskConfigUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyConfigRepository) private readonly _configRepository: IAlgoStrategyConfigRepository,
    ) { }

    async execute(input: UpdateStrategyRiskDTO): Promise<AlgoStrategyRiskConfig> {
        const config = AlgoStrategyRiskConfig.create({
            strategyName: input.strategyName,
            riskAmount: input.riskAmount,
            maxTradesPerDay: input.maxTradesPerDay,
            stopLoss: input.stopLoss,
            takeProfit: input.takeProfit,
        });

        return await this._configRepository.save(config);
    }
}
