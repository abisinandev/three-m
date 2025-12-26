import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { TransactionEntity } from "@domain/entities/transaction.entity";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export const toEntity = (data: AddToWalletDTO) => {
    return TransactionEntity.create({
        amount: data.amount,
        userId: data.userId,
        userCode: data.userCode as string,
        currency: data.currency,
        type: TransactionTypes.ADD_TO_WALLET,
        referenceType: data.referenceType,
        status: data.status,
        paymentStatus: data.paymentStatus,
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
        paymentIntentId: transaction.paymentIntentId,
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