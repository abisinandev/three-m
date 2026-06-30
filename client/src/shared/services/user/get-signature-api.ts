import api from "@/lib/axios-user"
import { API_ROUTES } from "@shared/constants/apiRoutes"

export const GetSignatureApi = async (folder?: string) => {
    const res = await api.get(API_ROUTES.USER.FILE_UPLOAD.SIGN_URL, {
        params: { folder }
    });
    return res.data;
};