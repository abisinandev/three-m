export interface ISlTpOrderQueue {
    addSlTpQueue(orderId: string): Promise<void>;
}