import api from "@/lib/axios-user";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { ChatHistoryMessage, ChatResponse } from "@shared/types/chatbot/chatbot.types";


export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
    const response = await api.post(API_ROUTES.CHATBOT.CHAT, { message });
    return response.data.data as ChatResponse;
};

export const getChatHistory = async (): Promise<ChatHistoryMessage[]> => {
    const response = await api.get(API_ROUTES.CHATBOT.HISTORY);
    return response.data.data ?? [];
};

export const confirmBotOrder = async (symbol: string, quantity: number) => {
    const response = await api.post(API_ROUTES.CHATBOT.CONFIRM_ORDER, { symbol, quantity });
    return response.data;
};
