export interface IExecuteLimitSellOrderUseCase {
    execute(orderId: string): Promise<void>;
}
