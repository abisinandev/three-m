import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { UserFilters } from "@shared/types/admin/user-management.types";


export const FetchUserDetail = async (filters: UserFilters) => {
    const response = await adminApi.get(API_ROUTES.ADMIN.USERS.FETCH_ALL, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data
}