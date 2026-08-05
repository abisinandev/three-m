import { fetchDashboardData } from "@/shared/services/dashboard/dashboard-service";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["user-dashboard"],
        queryFn: fetchDashboardData,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    return { data, isLoading, isError };
};

