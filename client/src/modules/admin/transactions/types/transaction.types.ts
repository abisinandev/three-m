export interface Transaction {
    id: string;
    userId: string;
    userCode: string;
    amount: number;
    currency: string;
    createdAt: string;
    status: string;
    referenceType?: string;
    transactionId: string;
    type: string;
    fundId?: string;
}

export interface TransactionsResponse {
    success: boolean;
    message: string;
    data: {
        data: Transaction[];
        total: number;
        totalPages: number;
        limit: number;
        page: number;
        successfulTransactions: number;
        failedTransactions: number;
        pendingTransactions: number;
        totalAmount: number;
    };
}
