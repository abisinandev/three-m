import { TransactionEntity } from "@domain/entities/transaction.entity"
import { TransactionDocument } from "@infrastructure/databases/mongo_db/models/schemas/transaction.schema"
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
        isVerified: doc.isVerified,
        txHash: doc.txHash,
        signature: doc.signature,
        fundId: doc.fundId ?? undefined,
        units: doc.units ?? undefined,
        status: doc.status,
        paymentStatus: doc.paymentStatus,
        referenceType: doc.referenceType,
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
        paymentStatus: data.paymentStatus,
        isVerified: data.isVerified,
        txHash: data.txHash,
        signature: data.signature,
        fundId: data.fundId ?? null,
        units: data.units ?? null,
        referenceType: data.referenceType,
        receipt_url: data.receipt_url,
        createdAt: data.createdAt ?? undefined,
        paymentIntentId: data.paymentIntentId,
    };
};

export const TransactionMapper = {
    toDomain,
    toPersistance
}