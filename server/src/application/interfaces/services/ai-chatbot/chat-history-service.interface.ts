import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";

export interface IChatHistoryService {
    saveMessage(userId: string, role: "user" | "assistant", content: string): Promise<void>;
    getConversationHistory(userId: string): Promise<ChatMessage[]>;
    clearConversation(userId: string): Promise<void>;
    findLastAnswer(userId: string, query: string): Promise<string | null>;
}
