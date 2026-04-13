import { StripePaymentDTO } from "@application/dto/user/stripe-payment-dto";

export interface IPaymentHandler {
    handleSuccess(payment: StripePaymentDTO): void;
}