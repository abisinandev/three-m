import { injectable, multiInject } from "inversify";
import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";
import { IPaymentPurposeHandler } from "@application/interfaces/services/payment/payment-purpose-handler.interface";
import { PAYMENT_TYPES } from "@infrastructure/inversify_di/features/payment/payment.types";
import { ValidationError } from "@presentation/express/utils/error-handling";
import { IFulfillPaymentUseCase } from "./interfaces/full-fill-payment-usecase.interface";


@injectable()
export class FulfillPaymentUseCase implements IFulfillPaymentUseCase {
    constructor(
        @multiInject(PAYMENT_TYPES.PaymentPurposeHandler) private readonly _purposeHandlers: IPaymentPurposeHandler[]
    ) { }

    async execute(payment: PaymentDataDTO): Promise<void> {
        const handler = this._purposeHandlers.find(h => h.purpose === payment.purpose);

        if (!handler) {
            throw new ValidationError(`No handler found for payment purpose: ${payment.purpose}`);
        }

        await handler.handle(payment);
    }
}
