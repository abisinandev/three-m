import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { UserFilters } from "@shared/types/admin/user-management.types";


import type { User } from "@shared/components/interfaces/IUserTable";

export interface PaginatedUsersResponse {
    data: User[];
    total: number;
    totalActiveUsersCount: number;
    totalInActiveUsersCount: number;
    totalVerifiedUsersCount: number;
}

export const FetchUserDetail = async (filters: UserFilters): Promise<{ data: PaginatedUsersResponse }> => {
    const response = await adminApi.get(API_ROUTES.ADMIN.USERS.FETCH_ALL, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
}