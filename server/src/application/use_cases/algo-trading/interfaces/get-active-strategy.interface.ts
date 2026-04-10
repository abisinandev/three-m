import { AlgoStrategyEntity } from "@domain/entities/algo/algo-strategy.entity";

export interface IGetActiveStrategyUseCase {
    execute(userId: string, symbol: string): Promise<AlgoStrategyEntity | null>;
}
