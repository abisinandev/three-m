import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { Types } from "mongoose";

export interface ITransactionSchema {
  userId: Types.ObjectId;
  userCode: string;
  amount: number;
  currency: string;
  transactionId: string;
  type: TransactionTypes;
  status: TransactionStatus;
  paymentStatus: TransactionStatus;
  isVerified: boolean;
  fundId?: string | null;
  units?: number | null;
  txHash: string;
  signature: string;
  referenceType: ReferenceType;
  paymentIntentId: string;
  receipt_url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
