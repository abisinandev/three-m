import { IFulfillPaymentUseCase } from "@application/use_cases/payment/interfaces/full-fill-payment-usecase.interface";
import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";
import stripe from "@infrastructure/providers/payment/stripe/stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { extractPaymentIntent, mapIntentToDTO } from "@shared/utils/payments/stripe-payment.utils";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WebhookController {
    constructor(
        @inject(PAYMENT_TYPES.FulfillPaymentUseCase) private readonly _fulfillPayment: IFulfillPaymentUseCase,
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

            if (event.type !== "payment_intent.succeeded") {
                return res.status(200).json({ received: true });
            }

            const intent = await extractPaymentIntent(event);
            if (!intent) return res.json({ received: true });
            
            const paymentDTO = mapIntentToDTO(intent);
            await this._fulfillPayment.execute(paymentDTO);
            return res.status(200).json({ received: true });

        } catch (error) {
            next(error);
        }
    }
}






