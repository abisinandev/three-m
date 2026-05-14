import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { ClientSession } from "mongoose";

export interface IWalletService {
    debit(
        wallet: WalletEntity,
        amount: number,
        session: ClientSession
    ): Promise<void>;

    credit(
        wallet: WalletEntity,
        amount: number,
        session: ClientSession
    ): Promise<void>;
}
