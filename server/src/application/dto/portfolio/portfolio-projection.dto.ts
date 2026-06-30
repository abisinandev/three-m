export interface PortfolioProjectionDTO {
    expectedReturnRate: number,
    years: number,
}

export interface PortfolioProjectionResponseDTO {
    currentValue: number;
    projectedValue: number;
    projectedProfit: number;
    futureTotalInvestment: number;
    yearlyBreakdown: Array<{
        year: number;
        value: number;
    }>;
}