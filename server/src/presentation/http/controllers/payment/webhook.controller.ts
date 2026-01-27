import { USER_TYPES } from "@infrastructure/inversify_di/features/user/user.types";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { StripePaymentHandler } from "@shared/utils/payments/payment.handler";
import { extractPaymentIntent, mapIntentToDTO } from "@shared/utils/payments/stripe-payment.utils";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";


/**
 * Stripe webhook controller.
 * Handles Stripe webhook events to securely process completed payments.
 * @param req - Express request containing the raw webhook payload
 * @param res - Sends a success acknowledgment to Stripe
 * @param next - Express next function for error handling
 */

@injectable()
export class WebhookController {
    constructor(
        @inject(USER_TYPES.StripePaymentHandler)
        private readonly stripePaymentHandler: StripePaymentHandler,
    ) { }

    async stripeWebhookHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const sig = req.headers["stripe-signature"];
            if (!sig) throw new AppError("Missing stripe signature");

            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET
            );

            const intent = await extractPaymentIntent(event);
            if (!intent) return res.json({ received: true });

            const paymentDTO = mapIntentToDTO(intent);
            await this.stripePaymentHandler.handleSuccess(paymentDTO);
            return res.status(200).json({ received: true });
            
        } catch (error) {
            next(error);
        }
    }

}




