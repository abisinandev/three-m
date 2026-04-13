import { ErrorMessages } from "@shared/constants/error.messages";
import stripe from "@infrastructure/providers/stripe/stripe.client";
import { env } from "@presentation/express/utils/constants/env.constants";
import { UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";


/**
 * Creates a Stripe Checkout Session for a one-time payment.
 * is completed securely via Stripe webhooks after payment success.
 * @param req - Express request object containing amount and payment purpose
 * @param res - Express response object used to return the checkout URL
 * @param next - Express next function for error handling
 */

@injectable()
export class PaymentController {

    async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
        try {
            const { amount, purpose } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new UnauthorizedError(ErrorMessages.AUTH.UNAUTHORIZED);
            }

            if (!amount || amount <= 0) {
                throw new ValidationError(ErrorMessages.PAYMENT.INVALID_AMOUNT);
            }

            if (amount > 10000) {
                throw new ValidationError(ErrorMessages.PAYMENT.LIMIT_EXCEEDED);
            }

            const session = await stripe.checkout.sessions.create({
                mode: "payment",

                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            unit_amount: amount * 100,// converting to paisa
                            product_data: {
                                name: purpose,
                            },
                        },
                        quantity: 1,
                    },
                ],

                success_url: `${env.FRONTEND_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${env.FRONTEND_URL}/user/payment-failed`,

                payment_intent_data: {
                    metadata: {
                        purpose,
                        userId: userId,
                        amount: amount.toString(),
                    },
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


