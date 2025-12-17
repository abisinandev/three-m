import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import { UnauthorizedError } from "@presentation/express/utils/error-handling";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";

@injectable()
export class PaymentController {
    constructor() { }

    async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
            const { amount } = req.body;
            logger.info(`Payment amount: ${amount}`);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'inr',
                automatic_payment_methods: { enabled: true }
            });

            console.log('PaymentIntent: ', paymentIntent);
            return res.status(200).json({
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            next(error);
        }
    };

    async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
        try {
            const { amount, paymentType } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessage.UNAUTHORIZED);
            }

            if (!amount || amount <= 0) {
                throw new Error("Invalid amount");
            }

            const productName = paymentType || "Wallet Top-up";

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            unit_amount: amount * 100,
                            product_data: {
                                name: paymentType || "Wallet Top Up",
                                description: "Add money to wallet",
                            },
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${env.FRONTEND_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${env.FRONTEND_URL}/user/payment-failed`,
                metadata: {
                    purpose: "ADD_TO_WALLET",
                    userId: userId,
                },
            });


            return res.status(200).json({
                checkoutUrl: session.url,
            });
        } catch (error) {
            next(error);
        }
    }

}


