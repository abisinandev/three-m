// import { ClientSession } from "mongoose";

export interface IVerifyTransactionUseCase {
    execute(txId: string): Promise<{ isVerified: boolean }>;
    // checkWalletIntegrity(userId: string, session: ClientSession): Promise<void>;
}