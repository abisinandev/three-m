import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { ClientSession } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletRepository extends IBaseRepository<WalletEntity> {
    updateWallet(userId: string, balance: number, session: ClientSession): Promise<void>;
}