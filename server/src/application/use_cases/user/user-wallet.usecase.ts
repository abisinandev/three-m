import { inject, injectable } from "inversify";
import { IUserWalletUseCase } from "../interfaces/user/user-wallet-usecase.interface";
import { UserWalletDTO } from "@application/dto/user/user-wallet.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { IWalletRepository } from "@application/interfaces/repositories/wallet-repository.interface";
import { WalletEntity } from "@domain/entities/wallet.entity";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";

@injectable()
export class UserWalletUseCase implements IUserWalletUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(userId: string): Promise<UserWalletDTO> {

        const userExists = await this._userRepository.findById(userId);
        if (!userExists) {
            throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        }


        const isExistWallet = await this._walletRepository.findOne({ userId });
        if (!isExistWallet) {
            const wallet = new WalletEntity({
                userId,
                balance: 0,
                status: WalletStatus.ACTIVE,
                currency:CurrencyTypes.INR,
            })

            await this._walletRepository.create(wallet);
        }

        const wallet = await this._walletRepository.findOne({ userId });
        if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);
        
        return {
            id: wallet.id as string,
            userId: wallet.userId,
            balance: wallet.balance,
            currency: wallet.currency,
            status: wallet.status,
            isVerified: wallet.isVerified,
            createdAt: wallet.createdAt?.toDateString() || null,
            updatedAt: wallet.updatedAt?.toDateString() || null
        }
    }
}