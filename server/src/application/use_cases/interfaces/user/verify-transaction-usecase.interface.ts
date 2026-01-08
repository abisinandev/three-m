export interface IVerifyTransactionUseCase {
    execute(txId: string): Promise<{ isVerified: boolean }>;
}