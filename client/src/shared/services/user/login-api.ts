import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes"
import type { LoginType } from "@shared/types/user/LoginTypes"


export const LoginApi = async (data: LoginType) => {
    const response = await api.post(API_ROUTES.USER.AUTH.LOGIN, data, {
        headers: { "Content-Type": "application/json" }
    })
    console.log("Login response: ", response);
    return response.data;
}