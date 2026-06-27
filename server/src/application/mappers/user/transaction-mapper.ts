import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";

export const toTransactionEntity = (data: AddToWalletDTO) => {

    return TransactionEntity.create({
        amount: data.amount,
        userId: data.userId,
        userCode: data.userCode as string,
        currency: data.currency,
        type: data.type,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        status: data.status,
        fundId: data.fundId ?? undefined,
        receipt_url: data.receipt_url,
        paymentIntentId: data.paymentIntentId,
    });
}

export const toTransactionResponse = (transaction: TransactionEntity): TransactionResponseDTO => {
    return {
        userCode: transaction.userCode,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        referenceType: transaction.referenceType,
        status: transaction.status,
        type: transaction.type,
        receipt_url: transaction.receipt_url,
        referenceId: transaction.referenceId?.toString(),
        createdAt: transaction.createdAt,
    }
}
