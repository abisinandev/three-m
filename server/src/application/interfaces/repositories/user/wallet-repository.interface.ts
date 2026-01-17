import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { ClientSession } from "mongoose";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletRepository extends IBaseRepository<WalletEntity> {
    debit(userId: string, amount: number, session: ClientSession): Promise<void>;
    credit(userId: string, amount: number, session: ClientSession): Promise<void>;
}