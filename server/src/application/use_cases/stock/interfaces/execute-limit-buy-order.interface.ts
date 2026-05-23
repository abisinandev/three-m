export interface IExecuteLimitBuyOrderUseCase {
    execute(orderId: string): Promise<void>;
}
