export interface IExecuteSlTpUseCase {
    execute(orderId: string): Promise<void>;
}
