export interface IStrategyQueue {
    addStrategyJob(strategyId: string): Promise<void>;
}
