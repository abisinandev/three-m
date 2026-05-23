import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const BlockUserDataApi = async (id: string) => {
    const response = await adminApi.patch(API_ROUTES.ADMIN.USERS.BLOCK(id), {
        withCredentials: true,
    });

    return response.data
}