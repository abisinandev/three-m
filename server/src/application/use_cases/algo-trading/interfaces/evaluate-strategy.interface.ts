export interface IEvaluateStrategyUseCase {
    execute(strategyId: string): Promise<{userId: string, symbol: string, strategyName: string, action: string, price: number, reason: string} | null>;
}
