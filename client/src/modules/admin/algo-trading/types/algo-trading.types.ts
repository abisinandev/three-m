export interface AlgoStatsData {
    activeStrategiesCount: number;
    activeSignalsCount: number;
    tradesExecutedTodayCount: number;
    failedTradesCount: number;
    marketStatus: string;
}

export interface AlgoStrategy {
    id: string;
    strategyName: string;
    isActive: boolean;
    usersCount: number;
    lastSignalTime?: string;
}

export interface AlgoSignal {
    id: string;
    symbol: string;
    strategyName: string;
    action: 'BUY' | 'SELL';
    price: string | number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}
export interface AlgoTrade {
    id: string;
    userId: string;
    orderId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    profit?: number;
    createdAt: string;
}
