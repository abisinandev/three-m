import { CreatePaymentRequest } from "@application/dto/payment/create-payment-req.dto";
import { IPaymentGateway } from "@application/interfaces/services/payment/payment-gateway.interface";
import { injectable } from "inversify";
import stripe from "./stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import Stripe from "stripe";

@injectable()
export class StripePaymentGateway implements IPaymentGateway {

    async createCheckoutSession(data: CreatePaymentRequest) {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        unit_amount: data.amount * 100,// converting to paisa
                        product_data: {
                            name: data.purpose,
                        },
                    },
                    quantity: 1,
                },
            ],

            success_url: `${env.FRONTEND_URL_DEV}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.FRONTEND_URL_DEV}/user/payment-failed`,

            payment_intent_data: {
                metadata: {
                    purpose: data.purpose,
                    userId: data.userId,
                    amount: data.amount.toString(),
                },
            },
        });

        return { url: session.url as string };
    }

    async verifyPayment(sessionId: string): Promise<Stripe.Checkout.Session> {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    }

    async PaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    }
}