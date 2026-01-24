export interface ISystemVerifyTransactionUseCase {
    execute(txId:string): Promise<{ isVerified: boolean }>
}

