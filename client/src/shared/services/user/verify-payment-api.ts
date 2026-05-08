import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const VerifyPaymentApi = async (sessionId: string) => {
    const res = await api.post(API_ROUTES.USER.PAYMENT.VERIFY, { sessionId });
    return res.data;
};
