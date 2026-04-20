import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export interface TransactionResponseDTO {
    id?: string;
    userId: string;
    userCode?: string;
    transactionId: string;
    amount: number;
    currency: string;
    type: TransactionTypes;
    // isVerified: boolean;
    referenceType: TransactionReferenceType;
    paymentIntentId: string;
    status: TransactionStatus;
    referenceId?: string;
    fundId?: string;
    // units?: number;
    receipt_url?: string;
    createdAt?: Date;
}
