import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { TransactionEntity } from "@domain/entities/transaction.entity";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

export const toEntity = (data: AddToWalletDTO) => {
    return TransactionEntity.create({
        amount: data.amount,
        userId: data.userId,
        currency: data.currency,
        type: TransactionTypes.ADD_TO_WALLET,
        referenceType: data.referenceType,
        status: data.status,
        receipt_url: data.receipt_url,
        paymentIntentId: data.paymentIntentId,
    });
}