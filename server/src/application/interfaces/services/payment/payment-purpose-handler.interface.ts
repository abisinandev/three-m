import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";

export interface IPaymentPurposeHandler {
    purpose: string;
    handle(payment: PaymentDataDTO): Promise<void>;
}