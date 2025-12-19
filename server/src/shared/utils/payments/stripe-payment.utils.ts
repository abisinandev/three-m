import { StripePaymentDTO } from "@application/dto/user/stripe-payment-dto";
import { TransactionStatus } from "@domain/enum/wallet/transaction-status.enum";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import Stripe from "stripe";

export async function extractPaymentIntent(event: Stripe.Event): Promise<Stripe.PaymentIntent | null> {
    switch (event.type) {
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
            return event.data.object as Stripe.PaymentIntent;

        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.payment_intent) return null;
            return stripe.paymentIntents.retrieve(
                session.payment_intent.toString()
            );
        }

        default:
            return null;
    }
}



export function mapIntentToDTO(intent: Stripe.PaymentIntent): StripePaymentDTO {
    const userId = intent.metadata?.userId;
    const purpose = intent.metadata?.purpose;

    if (!userId || !purpose) {
        throw new Error("Missing payment metadata");
    }

    const amountInPaise = intent.amount_received ?? intent.amount;
    if (!amountInPaise || amountInPaise <= 0) {
        throw new Error("Invalid payment amount");
    }

    return {
        userId,
        purpose: purpose as StripePaymentDTO["purpose"],
        paymentIntentId: intent.id,
        amount: amountInPaise / 100,
        currency: intent.currency,
        status: intent.status,
        
    };
}




export function mapStripeStatusToTransactionStatus(
    stripeStatus: Stripe.PaymentIntent.Status
): TransactionStatus {

    switch (stripeStatus) {

        case "requires_payment_method":
            return TransactionStatus.CREATED;

        case "requires_confirmation":
            return TransactionStatus.PENDING;

        case "requires_action":
            return TransactionStatus.PENDING;

        case "processing":
            return TransactionStatus.PROCESSING;

        case "succeeded":
            return TransactionStatus.SUCCESSFUL;

        case "canceled":
            return TransactionStatus.CANCELLED;

        default:
            return TransactionStatus.FAILED;
    }
}
