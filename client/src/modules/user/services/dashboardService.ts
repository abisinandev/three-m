import api from "@lib/axiosUser";
import type { DashboardData } from "../types/dashboard.types";

export const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get("/user/dashboard/overview");
    return response.data.data;
};
