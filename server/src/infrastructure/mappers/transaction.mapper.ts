import { TransactionEntity } from "@domain/entities/transaction.entity"
import { TransactionDocument } from "@infrastructure/databases/mongo_db/models/schemas/transaction.schema"

export const toDomain = (doc: TransactionDocument): TransactionEntity => {
    return TransactionEntity.fromPersistence({
        id: doc.id,
        userId: doc.userId,
        amount: doc.amount,
        currency: doc.currency,
        type: doc.type,
        isVerified: doc.isVerified,
        txHash: doc.txHash,
        fundId: doc.fundId ?? undefined,
        units: doc.units ?? undefined,
        status: doc.status,
        referencetype: doc.referenceType,
        createdAt: doc.createdAt,
        receipt_url: doc.receipt_url,
    });
};

export const toPersistance = (data: TransactionEntity): Partial<TransactionDocument> => {
    return {
        userId: data.userId,
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
    };
};

export const TransactionMapper = {
    toDomain,
    toPersistance
}