import { IBlockRepository } from "@application/interfaces/repositories/block-repository.interface";
import { ITransactionRepository } from "@application/interfaces/repositories/transaction-repository.interface";
import { BlockEntity } from "@domain/entities/block.entity";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import { IAddToWalletUseCase } from "../interfaces/user/add-to-wallet-usecase.interface";
import { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { AddToWalletDTO } from "@application/dto/user/add-to-wallet.dto";
import { toEntity } from "@application/mappers/user/transaction-mapper";
import { IWalletRepository } from "@application/interfaces/repositories/wallet-repository.interface";


/**
 * Adds funds to a user's wallet after a successful Stripe payment.
 *
 * This use case validates the user and wallet, ensures the transaction
 * is processed only once using the Stripe payment intent ID (idempotency),
 * records the transaction, creates a corresponding blockchain block,
 * and updates the wallet balance accordingly.
 *
 * If the transaction already exists, the operation is safely ignored.
 *
 * @returns Promise<void>
 */

@injectable()
export class AddToWalletUseCase implements IAddToWalletUseCase {
    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.BlockRepository) private readonly _blockRepository: IBlockRepository,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
    ) { }

    async execute(data: AddToWalletDTO): Promise<void> {

        const user = await this._userRepository.findById(data.userId);
        if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
        if(!user.isVerified) throw new ValidationError(ErrorMessage.USER_NOT_VERIFIED)

        const wallet = await this._walletRepository.findById(user.walletId as string);

        const transaction = toEntity(data);
        const isExists = await this._transactionRepository.findByPaymentId(data.paymentIntentId);
        if (isExists) return;

        try {
            await this._transactionRepository.create(transaction);
        } catch (error: any) {
            if (error.code === 11000) return;
            throw error;
        }

        const lastBlock = await this._blockRepository.getLastBlock();
        const block = BlockEntity.create({
            index: lastBlock ? Number(lastBlock?.index) + 1 : 0,
            prevHash: lastBlock?.blockHash ?? "GENISIS",
            txHash: transaction.txHash
        });
        await this._blockRepository.create(block)
        let balance = wallet?.balance || 0;
        balance += data.amount
        await this._walletRepository.update(wallet?.id as string, { balance })
    }
}