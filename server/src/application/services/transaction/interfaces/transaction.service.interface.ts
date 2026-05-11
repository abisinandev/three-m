import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ClientSession } from "mongoose";

export interface ITransactionService {
    createInvestmentTransaction(
        user: UserEntity,
        amount: number,
        fundId: string,
        session: ClientSession
    ): Promise<TransactionEntity>;

    markSuccess(
        transaction: TransactionEntity,
        session: ClientSession
    ): Promise<void>;

    markFailed(
        transaction: TransactionEntity,
        session: ClientSession
    ): Promise<void>;
}
