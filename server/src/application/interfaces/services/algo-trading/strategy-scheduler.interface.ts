export interface IStrategyScheduler {
    start(): Promise<void>;
    stop(): Promise<void>;
}
