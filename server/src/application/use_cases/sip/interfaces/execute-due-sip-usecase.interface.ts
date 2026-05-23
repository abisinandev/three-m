export interface IExecuteDueSipsUseCase {
    execute(installmentId: string): Promise<void>;
}