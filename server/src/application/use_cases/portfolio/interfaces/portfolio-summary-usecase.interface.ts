export interface IPortfolioSummaryUseCase {
    execute(userId: string): Promise<{
        totalCount: number;
        totalInvestment: number;
        totalProfit: number;
        profitAfterSell: number;
        totalReturns: number;
        profitPercentage: number;
        currentValue: number;
        xirr: number | null;
    }>;
}
