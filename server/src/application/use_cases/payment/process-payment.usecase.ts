import { inject, injectable } from "inversify";
import { IProcessStripePaymentUseCase } from "./interfaces/process-payment-usecase.interface";
import Stripe from "stripe";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import { IAddToWalletUseCase } from "../user/interfaces/add-to-wallet-usecase.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IUpgradePremiumUseCase } from "../user/subscription/interfaces/upgrade-premium-usecase.interface";
import { ReferenceType } from "@domain/enum/wallet/transaction-reference.enum";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import { TransactionTypes } from "@domain/enum/wallet/transaction-types.enum";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";

@injectable()
export class ProcessStripePaymentUseCase implements IProcessStripePaymentUseCase {

    constructor(
        @inject(USER_TYPES.AddToWalletUseCase) private readonly _addToWallet: IAddToWalletUseCase,
        @inject(SUBSCRIPTION_TYPES.UpgradePremiumUseCase) private readonly _upgradePremium: IUpgradePremiumUseCase,

    ) { }

    async execute(session: Stripe.Checkout.Session): Promise<{ success: boolean; message?: string }> {

        const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
        );

        if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment not successful");
        }

        const metadata = paymentIntent.metadata;

        if (!metadata?.userId || !metadata?.purpose) {
            throw new Error("Invalid metadata");
        }

        const userId = metadata.userId;
        const purpose = metadata.purpose;
        const amount = Number(metadata.amount);

        const paymentData = {
            userId,
            amount,
            paymentIntentId: paymentIntent.id,
            currency: paymentIntent.currency,
            receipt_url: "",
            referenceType: TransactionReferenceType.STRIPE,
            status: TransactionStatus.PENDING,
        };

        switch (purpose) {
            case "TOPUP":
                await this._addToWallet.execute({
                    ...paymentData,
                    type: TransactionTypes.ADD_TO_WALLET,
                });
                break;

            case "SUBSCRIPTION":
                await this._upgradePremium.execute({
                    ...paymentData,
                    type: TransactionTypes.SUBSCRIPTION,
                });
                break;

            default:
                throw new Error("Unknown payment purpose");
        }

        return { success: true };
    }
}
