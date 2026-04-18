export interface IStrategyService {
    evaluateStrategy(strategyId: string): Promise<any>;
}