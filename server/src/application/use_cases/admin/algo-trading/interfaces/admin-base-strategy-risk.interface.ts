import { UpdateStrategyRiskDTO } from "@application/dto/admin/algo-trading/strategy-risk.dto";
import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";
import { StrategyMetadata } from "@domain/entities/algo/strategy-metadata";

export interface StrategyWithRiskConfig extends StrategyMetadata {
    riskConfig?: AlgoStrategyRiskConfig;
}

export interface IAdminGetBaseStrategiesUseCase {
    execute(): Promise<StrategyWithRiskConfig[]>;
}

export interface IAdminUpdateStrategyRiskConfigUseCase {
    execute(data: UpdateStrategyRiskDTO): Promise<AlgoStrategyRiskConfig>;
}
