import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { TransactionEntity } from "@domain/entities/transaction.entity";
import { TransactionDocument, TransactionModel } from "@infrastructure/databases/mongo_db/models/schemas/transaction.schema";
import { ITransactionRepository } from "@application/interfaces/repositories/transaction-repository.interface";
import { TransactionMapper } from "@infrastructure/mappers/transaction.mapper";

@injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity, TransactionDocument> implements ITransactionRepository {
    constructor() {
        super(TransactionModel, TransactionMapper)
    }
}