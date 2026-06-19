export interface UpdateStrategyRiskDTO {
    strategyName: string;
    riskAmount: number;
    maxTradesPerDay: number;
    stopLoss: number;
    takeProfit: number;
}