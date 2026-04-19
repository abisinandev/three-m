import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
 import { Types } from "mongoose";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";

export interface ITransactionSchema {
  userId: Types.ObjectId;
  userCode: string;
  amount: number;
  currency: string;
  transactionId: string;
  type: TransactionTypes;
  status: TransactionStatus;
  paymentStatus: TransactionStatus;
  // isVerified: boolean;
  fundId?: string | null;
  // units?: number | null;
  // txHash: string;
  // signature: string;
  referenceType: | TransactionReferenceType;
  referenceId: string;
  paymentIntentId: string;
  receipt_url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
