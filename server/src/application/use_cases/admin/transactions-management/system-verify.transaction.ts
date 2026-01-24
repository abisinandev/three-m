import { BlockEntity } from "@domain/entities/transaction/block.entity";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { SignatureKey } from "@domain/value-objects/wallet/signature-key.vo";
import { TxHash } from "@domain/value-objects/wallet/transaction.vo";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
import { IBlockRepository } from "@application/interfaces/repositories/feature/block-repository.interface";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { ISystemVerifyTransactionUseCase } from "@application/use_cases/admin/interfaces/system-verify-transaction.interface";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { SipFailureReason } from "@domain/enum/funds/sip-failure-reason.enum";

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
export class SystemVerifyTransactionUseCase implements ISystemVerifyTransactionUseCase {

    constructor(
        @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
        @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
        @inject(USER_TYPES.BlockRepository) private readonly _blockRepository: IBlockRepository,
        @inject(FEATURE_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository
    ) { }

    async execute(txId: string): Promise<{ isVerified: boolean }> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const transaction = await this._transactionRepository.findTransaction(txId, session);
            if (!transaction) throw new NotFoundError(ErrorMessage.NOT_FOUND);

            if (transaction.type === TransactionTypes.ADD_TO_WALLET)
                throw new ValidationError("Admin verification required")

            if (transaction.status === TransactionStatus.VERIFIED) {
                await session.abortTransaction();
                return { isVerified: true };
            }

            if (transaction.status === TransactionStatus.PENDING) {
                throw new ValidationError("Transaction not in verifiable state");
            } 

            const payload = {
                txType: transaction.type,
                userId: transaction.userId,
                amount: transaction.amount,
                referenceType: transaction.referenceType,
                referenceId: transaction.referenceId,
            };
            console.log(payload,'System veirfy')
            const recalculatedHash = TxHash.generate(payload);
            if (recalculatedHash.value !== transaction.txHash) {
                throw new ValidationError("Transaction hash mismatch");
            }     

            const expectedSignature = SignatureKey.generate(recalculatedHash.value).value;
            if (expectedSignature !== transaction.signature) {
                throw new ValidationError("Invalid transaction signature");
            }

            const wallet = await this._walletRepository.findByUserId(transaction.userId as string, session);
            if (!wallet) throw new NotFoundError(ErrorMessage.WALLET_NOT_FOUND);
  
            if (   
                transaction.type === TransactionTypes.INVESTMENT ||
                transaction.type === TransactionTypes.SIP_INSTALLMENT
            ) {
                if (wallet.balance < transaction.amount) {
                    throw new ValidationError(ErrorMessage.INSUFFICIENT_BALANCE);
                }

                const sip = await this._sipInstallmentRepository.findById(transaction.referenceId as string);

                if (!sip || wallet.balance < sip.amount) {
                    await this._sipInstallmentRepository.markFailed(
                        transaction.id!,
                        SipFailureReason.INSUFFICIENT_FUNDS,
                    );
                }

                await this._walletRepository.debit(
                    wallet.userId as string,
                    transaction.amount,
                    session
                );
            }


            if (transaction.type === TransactionTypes.REDEMPTION) {
                await this._walletRepository.credit(
                    wallet.userId as string,
                    transaction.amount,
                    session
                );
            }

            const lastBlock = await this._blockRepository.getLastBlock(session);

            const block = BlockEntity.create({
                index: lastBlock ? lastBlock.index + 1 : 0,
                prevHash: lastBlock ? lastBlock.blockHash : "GENESIS",
                txHash: transaction.txHash,
            });

            await this._blockRepository.create(block, session);

            await session.commitTransaction();
            return { isVerified: true };


        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
     
