import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { BaseRepository } from "../base.repository";
import { injectable } from "inversify";
import { WalletMapper } from "@infrastructure/mappers/user/wallet.mapper";
import { ClientSession } from "mongoose";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { WalletDocument, WalletModel } from "@infrastructure/databases/mongo_db/models/schemas/user/wallet.schema";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class WalletRepository extends BaseRepository<WalletEntity, WalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel, WalletMapper)
    }

    async debit(userId: string, amount: number, session: ClientSession): Promise<void> {
        const res = await this.model.findOneAndUpdate(
            {
                userId,
                balance: { $gte: amount },
            },
            { $inc: { balance: -amount } },
            { session }
        );

        if (!res) {
            throw new AppError(ErrorMessages.WALLET.CONCURRENT_MODIFICATION);
        }
    };

    async credit(userId: string, amount: number, session: ClientSession): Promise<void> {
        const res = await this.model.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { session }
        );
        console.log(res,'000000')
    }

    async findByUserId(userId: string, session?: ClientSession): Promise<WalletEntity | null> {
        const doc = await this.model.findOne(
            { userId },
            null,
            session ? { session } : undefined
        );

        if (!doc) return null;

        return this.mapper.toDomain(doc);
    }
}