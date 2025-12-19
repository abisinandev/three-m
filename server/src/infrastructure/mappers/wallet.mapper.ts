import { WalletEntity } from "@domain/entities/wallet.entity";
import { WalletDocument } from "@infrastructure/databases/mongo_db/models/schemas/wallet.schema";
import { Types } from "mongoose";

export const toDomain = (doc: WalletDocument): WalletEntity => {
    return WalletEntity.fromPersistence({
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        currency: doc.currency,
        balance: doc.balance,
        status: doc.status,
        isVerified: doc.isVerified,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    })
}

export const toPersistance = (wallet: WalletEntity): Partial<WalletDocument> => {
    const toObjectId = (id?: string | null) =>
        id ? new Types.ObjectId(id) : undefined;
    return {
        userId: toObjectId(wallet.userId),
        currency: wallet.currency,
        balance: wallet.balance,
        status: wallet.status,
    }
}

export const WalletMapper = {
    toDomain,
    toPersistance
}