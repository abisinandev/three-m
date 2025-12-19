import { inject, injectable } from "inversify";
import { IUserWalletUseCase } from "../interfaces/user/user-wallet-usecase.interface";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { IWalletRepository } from "@application/interfaces/repositories/wallet-repository.interface";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { toEntity, toWalletResponse } from "@application/mappers/user/wallet.mapper";
import { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";
import { ITransactionRepository } from "@application/interfaces/repositories/transaction-repository.interface";

@injectable()
export class UserWalletUseCase implements IUserWalletUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
    ) { }

    async execute(userId: string): Promise<WalletResponseDTO> {

        const userExists = await this._userRepository.findById(userId);
        if (!userExists) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        const isExistWallet = await this._walletRepository.findOne({ userId });
        if (!isExistWallet) {
            const wallet = toEntity({
                userId,
                balance: 0,
                status: WalletStatus.ACTIVE,
                currency: CurrencyTypes.INR,
            })
            await this._walletRepository.create(wallet);
            const newWallet = await this._walletRepository.findOne({ userId });
            await this._userRepository.update(userId, { walletId: newWallet?.id });
        };

        const wallet = await this._walletRepository.findOne({ userId });
        if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);

        const transactions = await this._transactionRepository.findUserTransactions(userId) ?? [];
        return toWalletResponse(wallet, transactions);
    }
}