import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import { ValidationError } from "@presentation/express/utils/error-handling";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { StripePaymentHandler } from "@presentation/express/utils/payments/payment.handler";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import Stripe from "stripe";

@injectable()
export class WebhookController {
    constructor(
        @inject(USER_TYPES.StripePaymentHandler)
        private readonly stripePaymentHandler: StripePaymentHandler,
    ) { }

    async stripeWebhookHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const sig = req.headers['stripe-signature'];
            if (!sig) throw new ValidationError("Missing stripe signature");

            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET
            );

            logger.info(`Stripe event received: ${event.type}`);

            const intent = await extractPaymentIntent(event);
            console.log("Intent: ",intent)
            if (intent) {
                await this.stripePaymentHandler.handleSuccess(intent);
            } else {
                logger.info(`Ignored event type: ${event.type}`);
            }

            return res.json({ received: true });
        } catch (error) {
            next(error);
        }
    }

}


async function extractPaymentIntent(event: Stripe.Event): Promise<Stripe.PaymentIntent | null> {
    // if (event.type === "payment_intent.payment_failed") {
    //     const failedIntent = event.data.object as Stripe.PaymentIntent;
    //     logger.warn(`Payment failed: ${failedIntent.id}`);
    //     throw new AppError("Payment failed");
    // }

    switch (event.type) {
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
            return event.data.object as Stripe.PaymentIntent;

        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (!session.payment_intent) return null;
            return stripe.paymentIntents.retrieve(session.payment_intent.toString());
        }

        case "charge.succeeded":
        case "charge.updated": {
            const charge = event.data.object as Stripe.Charge;
            if (!charge.payment_intent) return null;
            return stripe.paymentIntents.retrieve(charge.payment_intent.toString());
        }

        default:
            return null;
    }
}
