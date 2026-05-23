import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";
import { StrategyMetadata } from "@domain/entities/algo/strategy-metadata";

export interface StrategyWithRiskConfig extends StrategyMetadata {
    riskConfig?: AlgoStrategyRiskConfig;
}

export interface IAdminGetBaseStrategiesUseCase {
    execute(): Promise<StrategyWithRiskConfig[]>;
}

export interface UpdateStrategyRiskDTO {
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
}

export interface IAdminUpdateStrategyRiskConfigUseCase {
    execute(input: UpdateStrategyRiskDTO): Promise<AlgoStrategyRiskConfig>;
}
