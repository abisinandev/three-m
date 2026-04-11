import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IChatHistoryService {
    saveMessage(userId: string, role: "user" | "assistant", content: string): Promise<void>;
    getConversationHistory(userId: string): Promise<ChatMessage[]>;
    clearConversation(userId: string): Promise<void>;
}
