import { inject, injectable } from "inversify";
import { ICreateCheckoutSessionUseCase } from "./interfaces/create-checkout-session-usecase.interface";
import { IPaymentGateway } from "@application/interfaces/services/payment/payment-gateway.interface";
import { CreatePaymentRequest } from "@application/dto/payment/create-payment-req.dto";
import { UnauthorizedError, ValidationError } from "@presentation/express/utils/error-handling";
import { ErrorMessages } from "@shared/constants/error.messages";

import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";

@injectable()
export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {

    constructor(
        @inject(PAYMENT_TYPES.PaymentGateway) private paymentGateway: IPaymentGateway,
    ) { }

    async execute(data: CreatePaymentRequest): Promise<{ url: string }> {

        const { amount, userId } = data;

        if (!userId) {
            throw new UnauthorizedError(ErrorMessages.AUTH.UNAUTHORIZED);
        }

        if (!amount || amount <= 0) {
            throw new ValidationError(ErrorMessages.PAYMENT.INVALID_AMOUNT);
        }

        if (amount > 100000) {
            throw new ValidationError(ErrorMessages.PAYMENT.LIMIT_EXCEEDED);
        }

        return await this.paymentGateway.createCheckoutSession(data);
    }
}