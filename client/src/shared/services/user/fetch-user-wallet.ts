import api from "@lib/axiosUser"
import { API_ROUTES } from "@shared/constants/apiRoutes"
import type { WalletResponse } from "@/modules/user/wallet/types/wallet.types";

export const FetchUserWallet = async (): Promise<WalletResponse> => {
    const response = await api.get(API_ROUTES.USER.WALLET.GET);
    return response.data
}