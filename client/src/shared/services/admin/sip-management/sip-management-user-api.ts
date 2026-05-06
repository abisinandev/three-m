import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const PauseSipStatus = async (sipId: string) => {
    const response = await api.patch(API_ROUTES.USER.MUTUAL_FUNDS.PAUSE_SIP(sipId));
    return response.data;
}
export const ResumeSipStatus = async (sipId: string) => {
    const response = await api.patch(API_ROUTES.USER.MUTUAL_FUNDS.RESUME_SIP(sipId));
    return response.data;
}
export const CancelSipStatus = async (sipId: string) => {
    const response = await api.patch(API_ROUTES.USER.MUTUAL_FUNDS.CANCEL_SIP(sipId));
    return response.data;
}