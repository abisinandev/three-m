export interface IOrderQueue {
    addLimitOrderJob(orderId: string): Promise<void>;
}
