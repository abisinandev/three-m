export type StrategyFilters = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export interface StrategyRiskConfig {
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
}

export interface AdminStrategy {
    id: string;
    strategyName: string;
    isActive: boolean;
    usersCount: number;
    lastSignalTime: string | null;
}

export interface AdminSignal {
    id: string;
    symbol: string;
    strategyName: string;
    action: 'BUY' | 'SELL';
    price: string | number;
    status: 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'PENDING';
    createdAt: string;
}

export interface AdminAlgoTrade {
    id: string;
    userId: string;
    orderId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: string | number;
    profit: number | null;
    createdAt: string;
}

export interface AdminTrade {
    id: string;
    userId: string;
    orderId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: string | number;
    profit?: number;
    isAlgoTrade: boolean;
    createdAt: string;
}
export interface BaseStrategy {
    name: string;
    displayName: string;
    configSchema: Array<{ key: string; default: string | number }>;
    riskConfig: StrategyRiskConfig | null;
}
export type AlgoTabName = 'Strategies' | 'Signals' | 'Trades' | 'Risk Settings';
