import { inject, injectable } from "inversify";
import { IProcessStripePaymentUseCase } from "./interfaces/process-payment-usecase.interface";
import { TransactionReferenceType } from "@domain/enum/wallet/transaction-reference-type";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";
import { IPaymentGateway } from "@application/interfaces/services/payment/payment-gateway.interface";
import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";
import { IFulfillPaymentUseCase } from "./interfaces/full-fill-payment-usecase.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { ErrorMessages } from "@shared/constants/error.messages";

@injectable()
export class ProcessStripePaymentUseCase implements IProcessStripePaymentUseCase {

    constructor(
        @inject(PAYMENT_TYPES.PaymentGateway) private readonly _stripePaymentGateway: IPaymentGateway,
        @inject(PAYMENT_TYPES.FulfillPaymentUseCase) private readonly _fulfillPayment: IFulfillPaymentUseCase
    ) { }

    async execute(sessionId: string): Promise<{ success: boolean; amount?: number; purpose?: string; message?: string }> {

        const session = await this._stripePaymentGateway.verifyPayment(sessionId);

        const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as { id: string }).id;

        const paymentIntent = await this._stripePaymentGateway.PaymentIntent(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            throw new ValidationError(ErrorMessages.PAYMENT.PAYMENT_NOT_SUCCESSFUL);
        }

        const metadata = paymentIntent.metadata;
        const userId = metadata.userId;
        const purpose = metadata.purpose as PaymentDataDTO["purpose"];
        const amount = Number(metadata.amount);

        if (!userId || !purpose || Number.isNaN(amount)) {
            throw new ValidationError(ErrorMessages.PAYMENT.INVALID_PAYMENT_METADATA);
        }

        const paymentData: PaymentDataDTO = {
            userId,
            amount,
            paymentIntentId: paymentIntent.id,
            currency: paymentIntent.currency,
            receipt_url: "",
            referenceType: TransactionReferenceType.STRIPE,
            status: paymentIntent.status,
            purpose: purpose
        };

        await this._fulfillPayment.execute(paymentData);

        logger.info(`Payment successful: ${amount}`);
        
        return {
            success: true,
            amount,
            purpose
        };
    }
}
