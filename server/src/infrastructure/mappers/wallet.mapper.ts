import { WalletEntity } from "@domain/entities/wallet.entity";
import { WalletDocument } from "@infrastructure/databases/mongo_db/models/schemas/wallet.schema";

export const toDomain = (doc: WalletDocument): WalletEntity => {
    return new WalletEntity({
        userId: doc.userId,
        currency: doc.currency,
        balance: doc.balance,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    })
}

export const toPersistance = (wallet: WalletEntity): Partial<WalletDocument> => {
    return {
        userId: wallet.userId,
        currency: wallet.currency,
        balance: wallet.balance,
        status: wallet.status,
    }
}

export const WalletMapper = {
    toDomain,
    toPersistance
}