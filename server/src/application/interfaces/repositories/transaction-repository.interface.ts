import { TransactionEntity } from "@domain/entities/transaction.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {
    findByPaymentId(paymentIntentId: string): Promise<TransactionEntity | null>;
    findUserTransactions(userId: string): Promise<TransactionEntity[] | null>;
}