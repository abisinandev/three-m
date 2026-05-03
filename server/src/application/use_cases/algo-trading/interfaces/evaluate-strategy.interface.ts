export interface IEvaluateStrategyUseCase {
    execute(strategyId: string): Promise<any>;
}
