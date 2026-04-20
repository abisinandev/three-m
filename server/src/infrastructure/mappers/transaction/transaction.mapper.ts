import { TransactionEntity } from "@domain/entities/transaction/transaction.entity"
import { TransactionDocument } from "@infrastructure/databases/mongo_db/models/schemas/transaction/transaction.schema";
import { Types } from "mongoose";

export const toDomain = (doc: TransactionDocument): TransactionEntity => {
    return TransactionEntity.fromPersistence({
        id: doc.id,
        userId: doc.userId.toString(),
        userCode: doc.userCode,
        transactionId: doc.transactionId,
        amount: doc.amount,
        currency: doc.currency,
        type: doc.type,
        status: doc.status,
        referenceType: doc.referenceType,
        referenceId:
            typeof doc.referenceId === 'string' && doc.referenceId.length > 0
                ? doc.referenceId
                : undefined,
        createdAt: doc.createdAt,
        receipt_url: doc.receipt_url as string,
        paymentIntentId: doc.paymentIntentId,
    });
};

export const toPersistance = (data: TransactionEntity): Partial<TransactionDocument> => {
    const toObjectId = (id?: string | null) =>
        id ? new Types.ObjectId(id) : undefined;

    return {
        transactionId: data.transactionId,
        userId: toObjectId(data.userId),
        userCode: data.userCode,
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: data.status,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        receipt_url: data.receipt_url,
        createdAt: data.createdAt ?? undefined,
        paymentIntentId: data.paymentIntentId ?? undefined,
    };
};

export const TransactionMapper = {
    toDomain,
    toPersistance
}
