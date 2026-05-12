export interface IProcessOrderJobUseCase {
    execute(jobName: string, orderId: string): Promise<void>;
}
