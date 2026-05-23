export interface IExecuteMarketSellOrderUseCase {
    execute(orderId: string): Promise<void>;
}
