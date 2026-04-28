export interface AlgoStrategyDTO {
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
}

export interface ISaveAlgoStrategyUseCase {
    execute(data: AlgoStrategyDTO): Promise<any>;
}
