import { WalletEntity } from "@domain/entities/wallet.entity";
import { IBaseRepository } from "./base-repository.interface";
import { ClientSession } from "mongoose";

export interface IWalletRepository extends IBaseRepository<WalletEntity> {
    updateWallet(userId: string, balance: number, session: ClientSession): Promise<void>;
}