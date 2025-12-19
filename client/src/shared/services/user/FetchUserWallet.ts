import api from "@lib/axiosUser"

export const FetchUserWallet = async () => {
    const response = await api.get('/user/wallet');
    return response.data
}