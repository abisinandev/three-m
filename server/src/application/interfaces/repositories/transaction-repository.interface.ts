import { TransactionEntity } from "@domain/entities/transaction.entity";
import { IBaseRepository } from "./base-repository.interface";
 
export interface ITransactionRepository extends IBaseRepository<TransactionEntity> {

}