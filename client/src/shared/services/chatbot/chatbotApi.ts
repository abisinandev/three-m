import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";

export interface ChatHistoryMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface ChatResponse {
    message: string;
    upgradeRequired?: boolean;
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
    const response = await api.post(API_ROUTES.CHATBOT.CHAT, { message });
    return response.data.data as ChatResponse;
};

export const getChatHistory = async (): Promise<ChatHistoryMessage[]> => {
    const response = await api.get(API_ROUTES.CHATBOT.HISTORY);
    return response.data.data ?? [];
};
