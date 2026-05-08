import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";

export interface IFulfillPaymentUseCase {
    execute(payment: PaymentDataDTO): Promise<void>;
}