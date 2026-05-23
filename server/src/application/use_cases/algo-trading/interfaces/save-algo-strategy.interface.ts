export interface AlgoStrategyDTO {
    userId: string;
    symbol: string;
    strategyName: string;
    config: Record<string, unknown>;
}

export interface ISaveAlgoStrategyUseCase {
    execute(data: AlgoStrategyDTO): Promise<{ message: string, upgrade: boolean } | undefined>;
}
