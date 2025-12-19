import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export interface TransactionResponseDTO {
    id?: string;
    userId: string;
    amount: number;
    currency: string;
    type: TransactionTypes;
    isVerified: boolean;
    txHash: string;
    referenceType: ReferenceType;
    paymentIntentId: string;
    status: TransactionStatus;
    fundId?: string;
    units?: number;
    receipt_url?: string;
    createdAt?: Date;
}