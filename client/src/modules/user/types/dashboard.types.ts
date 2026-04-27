export interface DashboardWallet {
    balance: number;
    currency: string;
}

export interface DashboardExpense {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    needsSpent: number;
    wantsSpent: number;
    savingsSpent: number;
}

export interface DashboardPortfolio {
    totalHoldings: number;
    stockHoldingsCount: number;
    totalInvestedAmount: number;
}

export interface PortfolioGrowthPoint {
    month: string;
    amount: number;
}

export interface DashboardSip {
    id: string;
    schemeCode: string;
    schemeName?: string;
    logo?: string;
    amount: number;
    frequency: string;
    status: string;
    executedInstallments: number;
    totalInstallments: number;
    nextExecutionDate: string;
}

export interface DashboardInvestment {
    id: string;
    schemeCode: string;
    schemeName?: string;
    logo?: string;
    amount: number;
    units: number;
    nav: number;
    status: string;
    investmentType: string;
    createdAt: string;
}

export interface DashboardData {
    wallet: DashboardWallet | null;
    expense: DashboardExpense | null;
    portfolio: DashboardPortfolio | null;
    totalMutualFundInvestment: number;
    portfolioGrowth: PortfolioGrowthPoint[];
    recentSips: DashboardSip[];
    recentInvestments: DashboardInvestment[];
}
