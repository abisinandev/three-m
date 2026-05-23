import { CreatePaymentRequest } from "@application/dto/payment/create-payment-req.dto";

export interface ICreateCheckoutSessionUseCase {
    execute(data: CreatePaymentRequest): Promise<{ url: string }>;
}