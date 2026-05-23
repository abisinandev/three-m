export interface IOrderQueue {
    addLimitOrderJob(orderId: string): Promise<void>;
    addMarketOrderJob(orderId: string): Promise<void>;
}
