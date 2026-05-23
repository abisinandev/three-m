import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const ChangePasswordApi = async (data: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}) => {
    const response = await api.post(API_ROUTES.USER.PROFILE.CHANGE_PASSWORD, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    console.log("Forgotpassword response: ", response);
    return response;
}