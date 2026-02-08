import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { BaseRepository } from "../base.repository";
import { injectable } from "inversify";
import { WalletMapper } from "@infrastructure/mappers/user/wallet.mapper";
import { ClientSession } from "mongoose";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { WalletDocument, WalletModel } from "@infrastructure/databases/mongo_db/models/schemas/user/wallet.schema";

@injectable()
export class WalletRepository extends BaseRepository<WalletEntity, WalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel, WalletMapper)
    }

    async debit(userId: string, amount: number, session: ClientSession): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId },
            { $inc: { balance: -amount } },
            { session }
        );
    };

    async credit(userId: string, amount: number, session: ClientSession): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { session }
        );
    }

    async findByUserId(userId: string, session?: ClientSession): Promise<WalletEntity | null> {
        const doc = await this.model.findOne({ userId });
        if (!doc) return null;
        return this.mapper.toDomain(doc);
    }
}