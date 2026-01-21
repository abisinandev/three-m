export interface IAdminVerifyTransactionUseCase {
    execute(txId: string): Promise<{ isVerified: boolean }>;
}