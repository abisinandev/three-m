import { IWalletService } from "./interfaces/wallet.service.interface";
import { WalletEntity } from "@domain/entities/user/wallet.entity";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { ClientSession } from "mongoose";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";

@injectable()
export class WalletService implements IWalletService {
    constructor(
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository
    ) { }

    async debit(
        wallet: WalletEntity,
        amount: number,
        session: ClientSession
    ): Promise<void> {
        wallet.debit(amount);
        await this._walletRepository.update(wallet.id as string, wallet, session);
    }

    async credit(
        wallet: WalletEntity,
        amount: number,
        session: ClientSession
    ): Promise<void> {
        wallet.credit(amount);
        await this._walletRepository.update(wallet.id as string, wallet, session);
    }
}
