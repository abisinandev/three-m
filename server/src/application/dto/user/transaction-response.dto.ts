import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export interface TransactionResponseDTO {
    userCode?: string;
    transactionId: string;
    amount: number;
    currency: string;
    type: TransactionTypes;
    referenceType: TransactionReferenceType;
    status: TransactionStatus;
    referenceId?: string;
    receipt_url?: string;
    createdAt?: Date;
}
