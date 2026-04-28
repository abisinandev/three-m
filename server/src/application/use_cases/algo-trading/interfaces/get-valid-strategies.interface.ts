import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";

export interface IGetValidStrategiesUseCase {
    execute(): Promise<AlgoStrategyEntity[]>;
}
