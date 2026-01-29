import api from "@lib/axiosUser"
import { FILE_UPLOAD_SIGN_URL } from "@shared/constants/userContants"

export const GetSignatureApi = async (userId: string, folder?: string) => {
    const res = await api.get(FILE_UPLOAD_SIGN_URL, {
        params: { userId, folder }
    });
    return res.data;
};