import Stripe from "stripe";

// export interface StripePaymentDTO {
//     userId: string;
//     paymentIntentId: string;
//     amount: number; // rupees
//     currency: string;
//     status: Stripe.PaymentIntent.Status;
// }

export interface StripePaymentDTO {
    userId: string;
    purpose: "WALLET_TOP_UP" | "INVEST_FUND" | "SUBSCRIPTION";
    amount: number;
    currency: string;
    paymentIntentId: string;
    status: Stripe.PaymentIntent.Status;
    receipt_url?: string;
    referenceType?: string;
}