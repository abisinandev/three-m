import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { AuthTypes } from "@shared/types/admin/AuthTypes";

export const AuthenticationApi = async (data: AuthTypes) => {
    const response = await adminApi.post(API_ROUTES.ADMIN.AUTH.LOGIN, data, {
        headers: { "Content-Type": "application/json" }
    })
    console.log("Authencation response: ", response);
    return response;
}