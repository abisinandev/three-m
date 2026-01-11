import type { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import type { IAddToWalletUseCase } from "../../interfaces/user/add-to-wallet-usecase.interface";
import { NotFoundError, UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { toEntity } from "@application/mappers/user/transaction-mapper";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { inject, injectable } from "inversify";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";

/**
 * Adds funds to a user's wallet after a successful payment.
 *
 * Validates the user and wallet, ensures the transaction is processed
 * only once using the payment intent ID, and records the transaction.
 *
 * @param data - The wallet top-up details.
 * @returns Promise<void>
 * @throws NotFoundError - If the user is not found.
 * @throws ValidationError - If the user is not verified or wallet limits are exceeded.
 */


@injectable()
export class AddToWalletUseCase implements IAddToWalletUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(data: AddToWalletDTO): Promise<void> {

        const user = await this._userRepository.findById(data.userId);
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        if (!user.isVerified) throw new ValidationError(ErrorMessage.USER_NOT_VERIFIED)

        const wallet = await this._walletRepository.findOne({ userId: user.id as string });
        if (wallet?.status === WalletStatus.FROZEN)
            throw new UnauthorizedError("We detected an inconsistency in your wallet. Please contact support");
        
        if (wallet && wallet.balance > 50000) {
            throw new ValidationError(ErrorMessage.WALLET_BALANCE_EXCEEDED);
        }

        const transaction = toEntity({ ...data, userCode: user.userCode });
        const isExists = await this._transactionRepository.findByPaymentId(data.paymentIntentId);
        if (isExists) return;

        try {
            await this._transactionRepository.create(transaction);
        } catch (error: any) {
            if (error.code === 11000) return;
            throw error;
        }

    }
}