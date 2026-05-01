import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../../../shared/services/dashboard/dashboardService";

export const useDashboard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user-dashboard"],
        queryFn: fetchDashboardData,
        staleTime: 1000 * 60 * 2,
    });

    return { data, isLoading, isError };
};
