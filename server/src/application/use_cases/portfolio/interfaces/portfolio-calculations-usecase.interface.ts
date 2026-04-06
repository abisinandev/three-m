export interface IPortfolioCalculationsUseCase {
    execute(userId: string): Promise<{
        totalCount: number;
        totalInvestment: number;
        totalProfit: number; // Unrealized
        realizedProfit: number;
        totalReturns: number; // Total = Realized + Unrealized
        profitPercentage: number;
        currentValue: number;
    }>;
}