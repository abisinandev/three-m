import Stripe from "stripe";

export interface PaymentDataDTO {
    userId: string;
    purpose: "TOPUP" | "INVEST" | "SUBSCRIPTION";
    amount: number;
    currency: string;
    paymentIntentId: string;
    status: Stripe.PaymentIntent.Status;
    receipt_url?: string;
    referenceType?: string;
}