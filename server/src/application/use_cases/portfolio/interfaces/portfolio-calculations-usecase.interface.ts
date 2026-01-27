export interface IPortfolioCalculationsUseCase {
    execute(userId: string): Promise<{
        totalCount: number;
        totalInvestment: number;
        totalProfit: number;
        profitPercentage: number;
        currentValue: number;
    }>;
}