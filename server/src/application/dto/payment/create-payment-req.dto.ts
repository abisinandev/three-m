export interface CreatePaymentRequest {
    userId: string;
    amount: number;
    purpose: string;
}