import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { Types } from "mongoose";

export interface ITransactionSchema {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  type: TransactionTypes;
  status: TransactionStatus;
  isVerified: boolean;
  fundId?: string | null;
  units?: number | null;
  txHash: string;
  referenceType: ReferenceType;
  paymentIntentId: string;
  receipt_url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
