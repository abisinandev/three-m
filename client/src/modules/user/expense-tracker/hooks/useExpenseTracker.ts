import { fetchAnalyticsData, fetchExpenseTrackerData, calculateBudgetPlan } from '@/shared/services/expense-tracker/expense-service';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';

export const useExpenseTracker = (selectedMonth: Date) => {
    const apiMonth = format(selectedMonth, 'yyyy-MM');

    const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery({
        queryKey: ['expense-details', apiMonth],
        queryFn: () => fetchExpenseTrackerData(apiMonth)
    });

    const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ['expense-analytics', apiMonth],
        queryFn: () => fetchAnalyticsData(apiMonth),
        enabled: !!dashboardData
    });

    const budgetPlanMutation = useMutation({
        mutationFn: (data: any) => calculateBudgetPlan(data),
    });

    return {
        dashboardData,
        analyticsData,
        isDashboardLoading,
        isAnalyticsLoading,
        refetchDashboard,
        budgetPlanMutation
    };
};

