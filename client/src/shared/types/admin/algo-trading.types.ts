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
