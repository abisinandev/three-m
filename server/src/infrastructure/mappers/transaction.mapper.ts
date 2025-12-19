import { TransactionEntity } from "@domain/entities/transaction.entity"
import { TransactionDocument } from "@infrastructure/databases/mongo_db/models/schemas/transaction.schema"
import { Types } from "mongoose";

export const toDomain = (doc: TransactionDocument): TransactionEntity => {
    return TransactionEntity.fromPersistence({
        id: doc.id,
        userId: doc.userId.toString(),
        amount: doc.amount,
        currency: doc.currency,
        type: doc.type,
        isVerified: doc.isVerified,
        txHash: doc.txHash,
        fundId: doc.fundId ?? undefined,
        units: doc.units ?? undefined,
        status: doc.status,
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
        userId: toObjectId(data.userId),
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: data.status,
        isVerified: data.isVerified,
        txHash: data.txHash,
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