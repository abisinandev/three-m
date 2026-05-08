export interface PieChartTooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            name: string;
            value: number;
            percent: number;
        };
    }>;
    totalValue: number;
}
