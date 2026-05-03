import { inject, injectable } from "inversify";
import { IAdminGetBaseStrategiesUseCase, StrategyWithRiskConfig } from "./interfaces/admin-base-strategy-risk.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyConfigRepository } from "@application/interfaces/repositories/algo/algo-strategy-config-repository.interface";
import { GetStrategiesUseCase } from "@application/use_cases/algo-trading/get-strategies.usecase";

@injectable()
export class AdminGetBaseStrategiesUseCase implements IAdminGetBaseStrategiesUseCase {
    constructor(
        @inject(STOCK_TYPES.AlgoStrategyConfigRepository) private readonly _configRepository: IAlgoStrategyConfigRepository,
        @inject(STOCK_TYPES.GetStrategiesUseCase) private readonly _getStrategies: GetStrategiesUseCase,
    ) { }

    async execute(): Promise<StrategyWithRiskConfig[]> {
        const hardcodedStrategies = this._getStrategies.execute();
        const riskConfigs = await this._configRepository.findAll();

        return hardcodedStrategies.map(strategy => {
            const riskConfig = riskConfigs.find(c => c.strategyName === strategy.name);
            return {
                ...strategy,
                riskConfig: riskConfig ? riskConfig : undefined
            };
        });
    }
}
