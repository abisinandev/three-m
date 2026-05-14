import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { DashboardData } from "../../../modules/user/dashboard/types/dashboard.types";

export const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get(API_ROUTES.USER.DASHBOARD.OVERVIEW);
    return response.data.data;
};
