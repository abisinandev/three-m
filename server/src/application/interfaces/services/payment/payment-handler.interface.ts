import { PaymentDataDTO } from "@application/dto/user/stripe-payment-dto";

export interface IPaymentHandler {
    handleSuccess(payment: PaymentDataDTO): void;
}