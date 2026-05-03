import { useQuery } from '@tanstack/react-query';
import { fetchExpenseTrackerData, fetchAnalyticsData } from '../../../shared/services/expense-tracker/expenseService';
import { format } from 'date-fns';

export const useExpenseTracker = (selectedMonth: Date) => {
    const apiMonth = format(selectedMonth, 'yyyy-MM');

    const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['expense-details', apiMonth],
        queryFn: () => fetchExpenseTrackerData(apiMonth)
    });

    const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ['expense-analytics', apiMonth],
        queryFn: () => fetchAnalyticsData(apiMonth),
        enabled: !!dashboardData
    });

    return {
        dashboardData,
        analyticsData,
        isDashboardLoading,
        isAnalyticsLoading
    };
};
