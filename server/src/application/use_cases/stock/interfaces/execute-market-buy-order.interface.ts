export interface IExecuteMarketBuyOrderUseCase {
    execute(orderId: string): Promise<void>;
}
