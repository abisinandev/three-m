// import type { IAdminVerifyTransactionUseCase } from "@application/use_cases/user/interfaces/admin-verify-transaction-usecase.interface";
// // import { BlockEntity } from "@domain/entities/transaction/block.entity";
// import { ErrorMessages } from "@shared/constants/error.messages";
// import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
// import { SignatureKey } from "@domain/entities/user/wallet-value-objects/signature-key.vo";
// import { TxHash } from "@domain/entities/user/wallet-value-objects/transaction.vo";
// import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
// import { NotFoundError, ValidationError } from "@presentation/express/utils/error-handling";
// import { inject, injectable } from "inversify";
// import mongoose from "mongoose";
// import stripe from "@infrastructure/providers/stripe/stripe.client";
// import { ITransactionRepository } from "@application/interfaces/repositories/feature/transaction-repository.interface";
// import { IWalletRepository } from "@application/interfaces/repositories/user/wallet-repository.interface";
// // import { IBlockRepository } from "@application/interfaces/repositories/feature/block-repository.interface";
// import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";

// /**
//  * Verifies a pending transaction.
//  *
// //  * Validates the transaction hash and signature, marks the transaction
//  * as verified, updates the user's wallet balance, and records the
//  * transaction in the blockchain.
//  *
//  * @param txId - The ID of the transaction to verify.
//  * @returns Promise<boolean> - True if verification succeeds, otherwise false.
//  * @throws NotFoundError - If the transaction or user is not found.
//  */

// @injectable()
// export class AdminVerifyTransactionUseCase implements IAdminVerifyTransactionUseCase {

//     constructor(
//         @inject(USER_TYPES.TransactionRepository) private readonly _transactionRepository: ITransactionRepository,
//         @inject(USER_TYPES.WalletRepository) private readonly _walletRepository: IWalletRepository,
//         // @inject(USER_TYPES.BlockRepository) private readonly _blockRepository: IBlockRepository,
//     ) { }

//     async execute(txId: string): Promise<{ isVerified: boolean }> {
//         const session = await mongoose.startSession();

//         try {
//             session.startTransaction();

//             const transaction = await this._transactionRepository.findTransaction(txId, session);
//             if (!transaction) throw new NotFoundError(ErrorMessages.USER.NOT_FOUND);
//             if (transaction.type !== TransactionTypes.ADD_TO_WALLET)
//                 throw new ValidationError(ErrorMessages.PAYMENT.EXTERNAL_VERIFICATION_ONLY)

//             if (transaction.status === TransactionStatus.VERIFIED) {
//                 await session.abortTransaction();
//                 return { isVerified: true };
//             }

//             if (transaction.status !== TransactionStatus.PENDING) {
//                 throw new ValidationError(ErrorMessages.PAYMENT.TRANSACTION_FAILED);
//             }

//             const payload = {
//                 txType: transaction.type,
//                 userId: transaction.userId,
//                 amount: transaction.amount,
//                 paymentIntentId: transaction.paymentIntentId,
//                 referenceType: transaction.referenceType,
//                 referenceId: transaction.referenceId ?? undefined,
//             };
//             const recalculatedHash = TxHash.generate(payload);
//             if (recalculatedHash.value !== transaction.txHash) {
//                 throw new ValidationError(ErrorMessages.PAYMENT.TRANSACTION_FAILED);
//             }

//             const expectedSignature = SignatureKey.generate(recalculatedHash.value).value;
//             if (expectedSignature !== transaction.signature) {
//                 throw new ValidationError(ErrorMessages.PAYMENT.TRANSACTION_FAILED);
//             }

//             await this._walletRepository.credit(
//                 transaction.userId as string,
//                 transaction.amount,
//                 session
//             );

//             await this._transactionRepository.updateStatus(
//                 transaction.id as string,
//                 TransactionStatus.VERIFIED,
//                 session
//             );

//             await session.commitTransaction();
//             return { isVerified: true };

//         } catch (error) {
//             await session.abortTransaction();
//             console.log("Transaction aborted: ", error);

//             if (
//                 error instanceof ValidationError &&
//                 error.message.includes("hash") &&
//                 error.message.includes("signature")
//             ) {
//                 const tx = await this._transactionRepository.findById(txId);
//                 if (tx?.paymentIntentId) {
//                     await stripe.refunds.create({
//                         payment_intent: tx.paymentIntentId,
//                         amount: tx.amount,
//                     });

//                     await this._transactionRepository.updateStatus(
//                         tx.id as string,
//                         TransactionStatus.REFUNDED,
//                         session
//                     );
//                 }
//             }

//             throw error;
//         } finally {
//             session.endSession();
//         }
//     }
// }

