export interface AddToWalletDTO{
    userId: string;
    amount: number;
    currency: string;
    referenceType: string;
    paymentIntentId: string;
    status: string;
    receipt_url: string;
}