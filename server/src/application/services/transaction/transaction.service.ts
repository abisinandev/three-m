import { ITransactionService } from "./interfaces/transaction.service.interface";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { ClientSession } from "mongoose";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";

@injectable()
export class TransactionService implements ITransactionService {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository
    ) { }

    async createInvestmentTransaction(
        user: UserEntity,
        amount: number,
        fundId: string,
        session: ClientSession
    ): Promise<TransactionEntity> {
        const transaction = TransactionEntity.create({
            userId: user.id!,
            userCode: user.userCode!,
            amount,
            currency: CurrencyTypes.INR,
            status: TransactionStatus.PENDING,
            type: TransactionTypes.INVESTMENT,
            referenceType: TransactionReferenceType.INVESTMENT,
            fundId: fundId,
        });

        return await this._transactionRepository.createTransaction(transaction, session);
    }

    async markSuccess(
        transaction: TransactionEntity,
        session: ClientSession
    ): Promise<void> {
        transaction.markSuccess();

        await this._transactionRepository.update(
            transaction.id!,
            transaction,
            session
        );
    }

    async markFailed(
        transaction: TransactionEntity,
        session: ClientSession
    ): Promise<void> {
        transaction.markFailed();

        await this._transactionRepository.update(
            transaction.id!,
            transaction,
            session
        );
    }

    async createSipTransaction(
        user: UserEntity,
        amount: number,
        fundId: string,
        referenceId: string,
        session: ClientSession
    ): Promise<TransactionEntity> {
        const transaction = TransactionEntity.create({
            userId: user.id!,
            userCode: user.userCode!,
            amount,
            currency: CurrencyTypes.INR,
            status: TransactionStatus.PENDING,
            type: TransactionTypes.SIP_INSTALLMENT,
            referenceType: TransactionReferenceType.SIP,
            referenceId: referenceId,
            fundId: fundId,
        });

        return await this._transactionRepository.createTransaction(transaction, session);
    }

    async createStockTransaction(
        user: UserEntity,
        amount: number,
        type: TransactionTypes.BUY | TransactionTypes.SELL,
        referenceId: string,
        session: ClientSession
    ): Promise<TransactionEntity> {
        const transaction = TransactionEntity.create({
            userId: user.id!,
            userCode: user.userCode!,
            amount,
            currency: CurrencyTypes.INR,
            status: TransactionStatus.PENDING,
            type,
            referenceType: TransactionReferenceType.WALLET,
            referenceId,
        });

        return await this._transactionRepository.createTransaction(transaction, session);
    }
}

