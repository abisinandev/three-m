import { FetchTransactionDTO } from "@application/dto/user/fetch-transactions.dto";
import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { QueryOptions } from "mongoose";

export interface IFetchTransactionsUseCase {
    execute(data: QueryOptions): Promise<FetchTransactionDTO<TransactionResponseDTO>>
}