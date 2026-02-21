export type IncomeSource =
    | 'SALARY'
    | 'BUSINESS'
    | 'FREELANCE'
    | 'OTHER';

export type SavingsState = 'MET' | 'MISSED' | 'EXCEEDED';




export interface FinancialSummary {
    totalSpent: number;
    lastMonthSpent: number;
    percentageChange: number;
    topCategory: string;
    topCategoryChange: number;
    spendingRatio: number;
    investmentRatio: number;
}

export interface Insight {
    id: string;
    type: "success" | "warning" | "critical" | "neutral";
    priority: number;
    title: string;
    message: string;
}

export interface InsightResult {
    insights: Insight[];
    healthScore: number;
}