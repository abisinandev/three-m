export interface IToggleAlgoStrategyUseCase {
    execute(userId: string, strategyId: string, isActive: boolean): Promise<void>;
}
