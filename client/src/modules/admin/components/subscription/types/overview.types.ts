export interface TrendChartData {
    month: string;
    revenue: number;
    subscriptions: number;
}

export interface SubscriptionTrendChartProps {
    data?: TrendChartData[];
}
