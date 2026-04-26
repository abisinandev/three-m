export interface DashboardWalletDTO {
    balance: number;
    currency: string;
}

export interface DashboardExpenseDTO {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    needsSpent: number;
    wantsSpent: number;
    savingsSpent: number;
}

export interface DashboardPortfolioDTO {
    totalHoldings: number;
    stockHoldingsCount: number;
    totalInvestedAmount: number;
}

export interface PortfolioGrowthPoint {
    month: string; 
    amount: number; 
}

export interface DashboardSipDTO {
    id: string;
    schemeCode: string;
    amount: number;
    frequency: string;
    status: string;
    executedInstallments: number;
    totalInstallments: number;
    nextExecutionDate: Date;
}

export interface DashboardInvestmentDTO {
    id: string;
    schemeCode: string;
    amount: number;
    units: number;
    nav: number;
    status: string;
    investmentType: string;
    createdAt: Date;
}

export interface DashboardDTO {
    wallet: DashboardWalletDTO | null;
    expense: DashboardExpenseDTO | null;
    portfolio: DashboardPortfolioDTO | null;
    totalMutualFundInvestment: number;
    portfolioGrowth: PortfolioGrowthPoint[];
    recentSips: DashboardSipDTO[];
    recentInvestments: DashboardInvestmentDTO[];
}
