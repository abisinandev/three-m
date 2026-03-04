import adminApi from "@lib/axiosAdmin";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export type UserFilters = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export const FetchUserDetail = async (filters: UserFilters) => {
    const response = await adminApi.get(API_ROUTES.ADMIN.USERS.FETCH_ALL, {
        withCredentials: true,
        params: filters,
        headers: { "Content-Type": "application/json" },
    });

    return response.data
}