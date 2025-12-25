import { TransactionEntity } from "@domain/entities/transaction.entity";
import { IBaseRepository } from "./base-repository.interface";
import { ClientSession, QueryOptions } from "mongoose";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
    findTransaction(id: string, session?: ClientSession): Promise<TransactionEntity | null>;
    updateStatus(id: string, status: string, session: ClientSession): Promise<void>;
    findByPaymentId(paymentIntentId: string): Promise<TransactionEntity | null>;
    findUserTransactions(userId: string): Promise<TransactionEntity[] | null>;
    findAllTransactions(options: QueryOptions): Promise<TransactionEntity[]>;
    findTotalTransactions(): Promise<{ totalTransactions: number }>;
    findSuccessfulTransactions(): Promise<{ successfulTransactions: number }>;
    findFailedTransactions(): Promise<{ failedTransactions: number }>;
    findPendingTransactions(): Promise<{ pendingTansactions: number }>;
    findTotalAmount(): Promise<{ totalAmount: number }>;
    findUserVerifiedTransactions(userId: string): Promise<TransactionEntity[] | null>;
}