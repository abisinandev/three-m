import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export const sendChatMessage = async (message: string): Promise<string> => {
    const response = await api.post(API_ROUTES.CHATBOT.CHAT, { message });
    return response.data.data;
};
