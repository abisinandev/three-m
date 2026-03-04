import api from "@lib/axiosUser"
import { API_ROUTES } from "@shared/constants/apiRoutes"

export const FetchUserWallet = async () => {
    const response = await api.get(API_ROUTES.USER.WALLET.GET);
    return response.data
}