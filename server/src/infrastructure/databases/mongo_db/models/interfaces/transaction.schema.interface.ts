import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export interface ITransactionSchema {
    userId: string;
    amount: number;
    currency: string;
    type: string;
    status: string;
    isVerified: boolean;
    fundId?: string | null;
    units?: number | null;
    txHash: string;
    referenceType: string;
    receipt_url: string;
    createdAt?: Date;
    updatedAt?: Date;
}