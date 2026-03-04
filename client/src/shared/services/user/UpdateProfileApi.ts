import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const UpdateProfileApi = async (data: {
    fullName: string;
    phone?: string;
    email?: string;
}) => {
    const response = await api.patch(API_ROUTES.USER.PROFILE.UPDATE, data);
    return response.data;
};

export const SendEmailOtpApi = async ({ email }: { email: string }) => {
    const response = await api.post(API_ROUTES.USER.PROFILE.SEND_EMAIL_OTP, { email });
    return response.data;
};

export const VerifyEmailOtpApi = async ({ email, otp }: { email: string; otp: string }) => {
    const response = await api.post(API_ROUTES.USER.PROFILE.VERIFY_EMAIL_OTP, { email, otp });
    return response.data;
};