export type TransactionStatus = 'SUCCESSFUL' | 'FAILED' | 'PENDING';
export type TransactionType = 'TOPUP' | 'WITHDRAW' | 'SUBSCRIPTION' | 'INVESTMENT' | 'REDEMPTION' | 'BUY' | 'SELL' | 'SIP_INSTALLMENT';

export interface WalletTransaction {
    id: string;
    userId: string;
    userCode: string;
    transactionId: string;
    amount: number;
    currency: 'inr';
    isVerified: boolean;
    paymentIntentId: string;
    referenceType: 'STRIPE';
    status: TransactionStatus;
    type: TransactionType;
    fundId?: string;
    receipt_url: string;
    units?: number;
    createdAt: string | Date;
}

export interface WalletData {
    balance: number;
    status: 'ACTIVE' | 'INACTIVE' | 'FROZEN';
    transactions: WalletTransaction[];
}

export interface WalletResponse {
    success: boolean;
    message: string;
    data: {
        data: WalletData;
    };
}
