import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";

export interface AddToWalletDTO{
    userId: string;
    userCode?: string;
    amount: number;
    currency: string;
    referenceType: ReferenceType;
    paymentIntentId: string;
    status: TransactionStatus;
    paymentStatus: TransactionStatus;
    receipt_url: string;
}