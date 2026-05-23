import api from "@/lib/axios-user"
import { API_ROUTES } from "@shared/constants/apiRoutes"

export const GetSignatureApi = async (userId: string, folder?: string) => {
    const res = await api.get(API_ROUTES.USER.FILE_UPLOAD.SIGN_URL, {
        params: { userId, folder }
    });
    return res.data;
};