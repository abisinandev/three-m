import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

type Data = {
    email: string,
    resetToken: string,
    password: string,
    confirmPassword: string,
}

export const ResetPasswordApi = async (data: Data) => {
    const response = await api.post(API_ROUTES.USER.AUTH.RESET_PASSWORD, data, {
        headers: { "Content-Type": "application/json" }
    })
    console.log("Forgotpassword response: ", response);
    return response;
}