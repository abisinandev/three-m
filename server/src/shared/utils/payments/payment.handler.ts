import { StripePaymentDTO } from "@application/dto/user/stripe-payment-dto";
import { IPaymentHandler } from "@application/interfaces/services/payment/payment-handler.interface";
import { IAddToWalletUseCase } from "@application/use_cases/user/interfaces/add-to-wallet-usecase.interface";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { mapStripeStatusToTransactionStatus } from "@shared/utils/payments/stripe-payment.utils";
import { inject, injectable } from "inversify";


/**
 * Handles successful Stripe payments and updates the system accordingly.
 */

@injectable()
export class StripePaymentHandler implements IPaymentHandler {
    constructor(
        @inject(USER_TYPES.AddToWalletUseCase) private addToWallet: IAddToWalletUseCase,
    ) { }

    async handleSuccess(payment: StripePaymentDTO) {

        const paymentStatus = mapStripeStatusToTransactionStatus(payment.status);
        switch (payment.purpose) {
            case "TOPUP":
                await this.addToWallet.execute({
                    userId: payment.userId,
                    amount: payment.amount,
                    paymentIntentId: payment.paymentIntentId,
                    currency: payment.currency,
                    receipt_url: "",
                    referenceType: ReferenceType.STRIPE,
                    status: TransactionStatus.PENDING,
                    paymentStatus,
                    type: TransactionTypes.ADD_TO_WALLET,
                });
                break;

            case "INVEST":
                // future
                break;

            case "SUBSCRIPTION":
                // future
                break;

            default:
                throw new Error(`Unknown purpose: ${payment.purpose}`);
        }
    }
}

