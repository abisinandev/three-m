import type { IVerifyTransactionUseCase } from "@application/use_cases/interfaces/user/verify-transaction-usecase.interface";
import { BlockEntity } from "@domain/entities/transaction/block.entity";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { SignatureKey } from "@domain/value-objects/wallet/signature-key.vo";
import { TxHash } from "@domain/value-objects/wallet/transaction.vo";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IBlockRepository } from "@application/interfaces/repositories/feature/block-repository.interface";

/**
 * Verifies a pending transaction.
 *
 * Validates the transaction hash and signature, marks the transaction
 * as verified, updates the user's wallet balance, and records the
 * transaction in the blockchain.
 *
 * @param txId - The ID of the transaction to verify.
 * @returns Promise<boolean> - True if verification succeeds, otherwise false.
 * @throws NotFoundError - If the transaction or user is not found.
 */

@injectable()
export class VerifyTransactionUseCase implements IVerifyTransactionUseCase {

    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(USER_TYPES.BlockRepository) private readonly _blockRepository: IBlockRepository,
    ) { }

    async execute(txId: string): Promise<{ isVerified: boolean }> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const storedTranx = await this._transactionRepository.findTransaction(txId, session);
            if (!storedTranx) throw new NotFoundError(ErrorMessage.NOT_FOUND);

            if (storedTranx.status === TransactionStatus.VERIFIED) {
                await session.abortTransaction();
                return { isVerified: true };
            }

            const payload = {
                userId: storedTranx.userId,
                amount: storedTranx.amount,
                fundId: storedTranx.fundId,
                units: storedTranx.units,
                paymentIntentId: storedTranx.paymentIntentId,
            };

            const reCalculatedHash = TxHash.generate(payload);
            const isHashValid = reCalculatedHash.value === storedTranx.txHash;
            const isSignatureValid =
                SignatureKey.generate(reCalculatedHash.value).value === storedTranx.signature;

            if (isHashValid && isSignatureValid) {

                await this._transactionRepository.updateStatus(
                    storedTranx.id as string,
                    TransactionStatus.VERIFIED,
                    session,
                );

                await this._walletRepository.debit(
                    storedTranx.userId as string,
                    storedTranx.amount,
                    session
                );

                const lastBlock = await this._blockRepository.getLastBlock(session);

                const block = BlockEntity.create({
                    index: lastBlock ? lastBlock.index + 1 : 0,
                    prevHash: lastBlock ? lastBlock.blockHash : "GENESIS",
                    txHash: storedTranx.txHash,
                });

                await this._blockRepository.create(block, session);

                await session.commitTransaction();
                return { isVerified: true };
            };

            if (storedTranx.status === TransactionStatus.PENDING && storedTranx.paymentIntentId) {
                await stripe.refunds.create({
                    payment_intent: storedTranx.paymentIntentId,
                    amount: storedTranx.amount,
                });

                await this._transactionRepository.updateStatus(
                    storedTranx.id as string,
                    TransactionStatus.FAILED,
                    session,
                )

                console.log(`Refund triggered for ${storedTranx.paymentIntentId}`);
            };
            return { isVerified: false };

        } catch (error) {
            await session.abortTransaction();
            console.log("Transaction aborted: ", error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}

