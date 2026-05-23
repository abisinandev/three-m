export interface ICancelLimitOrderUseCase {
    execute(orderId: string, userId: string): Promise<void>;
}
