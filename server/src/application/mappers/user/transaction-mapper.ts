import { WalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { TransactionEntity } from "@domain/entities/transaction/transaction.entity";

export const toTransactionEntity = (data: WalletDTO) => {
    return TransactionEntity.create({
        amount: data.amount,
        userId: data.userId,
        userCode: data.userCode as string,
        currency: data.currency,
        type: data.type,
        referenceType: data.referenceType,
        status: data.status,
        paymentStatus: data.paymentStatus,
        fundId: data.fundId ?? undefined,
        receipt_url: data.receipt_url,
        paymentIntentId: data.paymentIntentId,
    });
}

export const toTransactionResponse = (transaction: TransactionEntity): TransactionResponseDTO => {
    return {
        id: transaction.id,
        userId: transaction.userId,
        userCode: transaction.userCode,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        isVerified: transaction.isVerified,
        paymentIntentId: transaction.paymentIntentId as string,
        referenceType: transaction.referenceType,
        status: transaction.status,
        paymentStatus: transaction.paymentStatus,
        type: transaction.type,
        fundId: transaction.fundId,
        receipt_url: transaction.receipt_url,
        units: transaction.units,
        createdAt: transaction.createdAt,
    }
}