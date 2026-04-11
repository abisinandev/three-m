export interface ITurnOnAlgoTradingUseCase {
    execute(userId: string, strategyId: string, isActive: boolean): Promise<void>;
}
