import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";
import { IProcessStripePaymentUseCase } from "@application/use_cases/payment/interfaces/process-payment-usecase.interface";
import { ResponseHelper } from "@presentation/express/utils/response-handling/response.helper";
import { ICreateCheckoutSessionUseCase } from "@application/use_cases/payment/interfaces/create-checkout-session-usecase.interface";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { HttpStatus } from "@domain/enum/express/status-code";
import { SuccessMessages } from "@shared/constants/success.messages";


@injectable()
export class PaymentController {

    constructor(
        @inject(PAYMENT_TYPES.ProcessStripePaymentUseCase) private readonly _processPayment: IProcessStripePaymentUseCase,
        @inject(PAYMENT_TYPES.CreateCheckoutSessionUseCase) private readonly _createCheckSession: ICreateCheckoutSessionUseCase,
    ) { }

    async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const result = await this._createCheckSession.execute({
                ...req.body,
                userId
            });
            return ResponseHelper.success(
                res,
                SuccessMessages.PAYMENT.SESSION_CREATED,
                { checkoutUrl: result.url },
                HttpStatus.OK
            );
        } catch (error) {
            next(error);
        }
    }


    async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const { sessionId } = req.body;

            if (!sessionId) throw new ValidationError(
                SuccessMessages.PAYMENT.SESSION_EXPIRED,
            );

            const result = await this._processPayment.execute(sessionId);

            return ResponseHelper.success(
                res,
                SuccessMessages.PAYMENT.VERIFIED,
                {
                    amount: result.amount,
                    purpose: result.purpose,
                    status: 'SUCCESSFUL'
                },
                HttpStatus.OK
            );
        } catch (error) {
            next(error)
        }
    }
}
