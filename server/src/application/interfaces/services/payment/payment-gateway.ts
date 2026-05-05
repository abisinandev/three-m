import { CreatePaymentRequest } from "@application/dto/payment/create-payment-req.dto";
import Stripe from "stripe";

export interface IPaymentGateway {
    createCheckoutSession(data: CreatePaymentRequest): Promise<{ url: string }>;
    verifyPayment(sessionId: string): Promise<Stripe.Checkout.Session>;
    PaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
}