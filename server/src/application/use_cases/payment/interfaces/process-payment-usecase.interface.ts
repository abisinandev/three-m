import Stripe from "stripe";

export interface IProcessStripePaymentUseCase {
    execute(session: Stripe.Checkout.Session): Promise<{
        success: boolean;
        message?: string;
    }>;
}