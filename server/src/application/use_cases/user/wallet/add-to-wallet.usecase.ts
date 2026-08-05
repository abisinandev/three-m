import type { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import type { IAddToWalletUseCase } from "./interfaces/add-to-wallet-usecase.interface";
import { NotFoundError, UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { toTransactionEntity } from "@application/mappers/user/transaction-mapper";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { inject, injectable } from "inversify";
import { WalletStatus } from "@domain/enum/wallet/wallet-status.enum";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IUserRepository } from "@application/interfaces/repositories/user/user-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { ErrorMessages } from "@shared/constants/error.messages";
import mongoose from "mongoose";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";


@injectable()
export class AddToWalletUseCase implements IAddToWalletUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(data: AddToWalletDTO): Promise<void> {
        const session = await mongoose.startSession();

        try {

            await session.startTransaction();

            const user = await this._userRepository.findById(data.userId);
            if (!user) throw new NotFoundError(ErrorMessages.AUTH.USER_NOT_FOUND);
            if (!user.isVerified) throw new ValidationError(ErrorMessages.USER.NOT_VERIFIED)

            const wallet = await this._walletRepository.findOne({ userId: user.id as string });
            if (!wallet) throw new NotFoundError(ErrorMessages.WALLET.NOT_FOUND);

            if (wallet.status === WalletStatus.FROZEN)
                throw new UnauthorizedError(ErrorMessages.USER.WALLET_INCONSISTENCY);

            if (wallet && data.amount > 10_0000)
                throw new ValidationError(ErrorMessages.TRANSACTIONS.MAX_TRANSACTION)

            const transactionEntity = toTransactionEntity({ ...data, userCode: user.userCode });

            const isExists = await this._transactionRepository.findByPaymentId(
                data.paymentIntentId as string,
                session
            );
            if (isExists) {
                await session.commitTransaction();
                return;
            }


            try {

                await this._transactionRepository.createTransaction(transactionEntity, session);

            } catch (error: unknown) {
                if (
                    typeof error === "object" && error !== null && "code" in error &&
                    (error as { code: number }).code === 11000
                ) {
                    await session.commitTransaction();
                    return;
                }
                throw error;
            }

            if (data.status === TransactionStatus.SUCCESSFUL) {
                wallet.credit(data.amount);
                await this._walletRepository.credit(user.id as string, data.amount, session);
            }

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();

            console.log("AddToWallet: ", error);
            throw new AppError('Add to wallet payment process failed');
        } finally {
            session.endSession();
        }

    }
}