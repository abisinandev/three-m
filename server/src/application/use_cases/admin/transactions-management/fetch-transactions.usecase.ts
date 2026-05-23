import { FetchTransactionDTO } from "@application/dto/user/fetch-transactions.dto";
import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { toTransactionResponse } from "@application/mappers/user/transaction-mapper";
import { IFetchTransactionsUseCase } from "@application/use_cases/admin/transactions-management/interfaces/fetch-transactions-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { inject, injectable } from "inversify";
import { QueryOptions } from "mongoose";

@injectable()
export class FetchTransactionsUseCase implements IFetchTransactionsUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
    ) { }

    async execute(data: QueryOptions): Promise<FetchTransactionDTO<TransactionResponseDTO>> {
        const transactions = await this._transactionRepository.findAllTransactions(data) ?? [];
        const { totalTransactions } = await this._transactionRepository.findTotalTransactions();
        const { successfulTransactions } = await this._transactionRepository.findSuccessfulTransactions();
        const { pendingTansactions } = await this._transactionRepository.findPendingTransactions();
        const { failedTransactions } = await this._transactionRepository.findFailedTransactions();
        const { totalAmount } = await this._transactionRepository.findTotalAmount();
        
        return {
            data: transactions.map(tx => toTransactionResponse(tx)),
            limit: data.limit || 10,
            page: data.page || 1,
            total: totalTransactions,
            totalPages: Math.ceil(totalTransactions / (data.limit || 10)),
            successfulTransactions,
            pendingTansactions,
            failedTransactions,
            totalAmount,
        }
    };
}; 