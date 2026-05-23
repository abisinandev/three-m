export interface FetchTransactionDTO<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    successfulTransactions?: number;
    pendingTansactions?: number;
    failedTransactions?: number;
    totalAmount?: number
}