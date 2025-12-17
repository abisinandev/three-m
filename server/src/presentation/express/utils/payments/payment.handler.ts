import { IAddToWalletUseCase } from "@application/use_cases/interfaces/user/add-to-wallet-usecase.interface";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { inject, injectable } from "inversify";
import Stripe from "stripe";

@injectable()
export class StripePaymentHandler {
    constructor(
        @inject(USER_TYPES.AddToWalletUseCase)
        private addToWallet: IAddToWalletUseCase,
    ) { }

    async handleSuccess(intent: Stripe.PaymentIntent) {
        const purpose = intent.metadata?.purpose;
        const userId = intent.metadata?.userId;

        if (!purpose || !userId) {
            throw new Error("Missing required payment metadata");
        }

        const amountInPaise =
            intent.amount_received ?? intent.amount;

        if (!amountInPaise || amountInPaise <= 0) {
            throw new Error("Invalid payment amount");
        }

        const amount = amountInPaise / 100;

        switch (purpose) {
            case "ADD_TO_WALLET": {
                await this.addToWallet.execute({
                    userId,
                    amount,
                    paymentIntentId: intent.id,
                    currency: intent.currency,
                    receipt_url: "",
                    referenceType: ReferenceType.STRIPE,
                    status: intent.status,
                });
                break;
            }

            case "INVEST_FUND":
                // future logic
                break;

            case "SUBSCRIPTION":
                // future logic
                break;

            default:
                throw new Error(`Unknown payment purpose: ${purpose}`);
        }
    }
}
