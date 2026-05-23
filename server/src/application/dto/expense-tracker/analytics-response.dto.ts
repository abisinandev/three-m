export interface ComparisonData {
    thisMonth: number;
    lastMonth: number;
    difference: number;
    percentageChange: number;
}

export interface CategoryComparison {
    name: string;
    thisMonth: number;
    lastMonth: number;
}

export interface SpendingTrend {
    day: number;
    thisMonth: number;
    lastMonth: number;
}

export interface AnalyticsResponseDTO {
    comparison: ComparisonData;
    categoryComparison: CategoryComparison[];
    spendingTrend: SpendingTrend[];
    insights: {
        type: 'info' | 'warning' | 'success' | 'critical' | 'neutral';
        text: string;
        title?: string;
        id?: string;
        priority?: number;
    }[];
    healthScore: number;
}
