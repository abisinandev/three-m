import adminApi from '@/lib/axios-admin';
import { useQuery } from '@tanstack/react-query';
import type { AdminDashboardData } from '../types/dashboard.types';

export const useAdminDashboard = () => {
    return useQuery<AdminDashboardData>({
        queryKey: ['admin-dashboard-overview'],
        queryFn: async () => {
            const { data } = await adminApi.get('/dashboard/overview');
            return data.data; 
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
