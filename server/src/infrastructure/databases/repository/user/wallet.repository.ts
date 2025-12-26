import { WalletEntity } from "@domain/entities/wallet.entity";
import { BaseRepository } from "../base.repository";
import { WalletDocument, WalletModel } from "@infrastructure/databases/mongo_db/models/schemas/wallet.schema";
import { IWalletRepository } from "@application/interfaces/repositories/wallet-repository.interface";
import { injectable } from "inversify";
import { WalletMapper } from "@infrastructure/mappers/wallet.mapper";
import { ClientSession } from "mongoose";

@injectable()
export class WalletRepository extends BaseRepository<WalletEntity, WalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel, WalletMapper)
    }

    async updateWallet(userId: string, balance: number, session: ClientSession): Promise<void> {
        await this.model.findOneAndUpdate(
            { userId },
            { $inc: { balance: balance } },
            { session }
        );
    };
}