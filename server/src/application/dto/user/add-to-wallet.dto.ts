import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export interface WalletDTO {
    userId: string;
    userCode?: string;
    amount: number;
    currency: string;
    referenceType: TransactionReferenceType;
    referenceId: string;
    paymentIntentId?: string;
    status: TransactionStatus;
    type: TransactionTypes;
    fundId?: string;
    paymentStatus: TransactionStatus;
    receipt_url?: string;
}