export interface PortfolioProjectionDTO {
    expectedReturnRate: number,
    years: number,
}

export interface PortfolioProjectionResponseDTO {
    projectedValue: number;
    projectedProfit: number;
    futureTotalInvestment: number;
    yearlyBreakdown: Array<{
        year: number;
        value: number;
    }>;
}