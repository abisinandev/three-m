export interface SaveAlgoStrategyDTO {
    userId: string;
    symbol: string;
    strategyName: string;
    config: any;
}

export interface ISaveAlgoStrategyUseCase {
    execute(data: SaveAlgoStrategyDTO): Promise<void>;
}
