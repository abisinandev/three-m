import { AlgoStrategyRiskConfig } from "@domain/entities/algo/algo-strategy-config.entity";

export interface IAlgoStrategyConfigRepository {
    findByStrategyName(strategyName: string): Promise<AlgoStrategyRiskConfig | null>;
    findAll(): Promise<AlgoStrategyRiskConfig[]>;
    save(config: AlgoStrategyRiskConfig): Promise<AlgoStrategyRiskConfig>;
}
