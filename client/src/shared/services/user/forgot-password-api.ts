import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const ForgotPasswordApi = async (data: { email: string }) => {
    const response = await api.post(API_ROUTES.USER.AUTH.FORGOT_PASSWORD, data, {
        headers: { "Content-Type": "application/json" }
    })
    console.log("Forgotpassword response: ", response);
    return response;
}