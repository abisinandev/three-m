import type { IUserWalletUseCase } from "../interfaces/user/user-wallet-usecase.interface";
import type { FetchWalletDTO } from "@application/dto/user/fetch-wallet.dto";
import type { WalletResponseDTO } from "@application/dto/user/wallet-response.dto";
import type { TransactionResponseDTO } from "@application/dto/user/transaction-response.dto";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { toEntity } from "@application/mappers/user/wallet.mapper";
import { CurrencyTypes } from "@domain/enum/users/currency-enum";
import { toTransactionResponse } from "@application/mappers/user/transaction-mapper";
import { QueryOptions } from "mongoose";
import { inject, injectable } from "inversify";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";

@injectable()
export class UserWalletUseCase implements IUserWalletUseCase {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
    ) { }

    async execute(userId: string, query: QueryOptions): Promise<FetchWalletDTO<WalletResponseDTO>> {

        const userExists = await this._userRepository.findById(userId);
        if (!userExists) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

        let wallet = await this._walletRepository.findOne({ userId });
        if (!wallet) {
            const wallet = toEntity({
                userId,
                balance: 0,
                status: WalletStatus.ACTIVE,
                currency: CurrencyTypes.INR,
            });
            await this._walletRepository.create(wallet);
            const newWallet = await this._walletRepository.findOne({ userId });
            await this._userRepository.update(userId, { walletId: newWallet?.id });
        };

        wallet = await this._walletRepository.findOne({ userId });
        if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const transactions = (await this._transactionRepository.findUserTransactions(wallet.userId)) ?? [];
        const transactionResponses: TransactionResponseDTO[] = transactions.map(tx => toTransactionResponse(tx));

        const walletResponse: WalletResponseDTO = {
            id: wallet.id as string,
            userId: wallet.userId,
            balance: wallet.balance,
            currency: wallet.currency,
            status: wallet.status,
            createdAt: wallet.createdAt?.toISOString() ?? "",
            updatedAt: wallet.updatedAt?.toISOString() ?? "",
            transactions: transactionResponses,
        };

        return {
            data: walletResponse,
            limit,
            page,
            total: 1,
            totalPages: 1
        }
    }
}