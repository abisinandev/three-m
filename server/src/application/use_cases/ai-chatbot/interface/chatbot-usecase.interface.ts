import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";

export interface IChatbotUseCase {
    execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?: boolean,
        type?: string,
        data?: unknown
    }>;

    getHistory(userId: string): Promise<ChatMessage[]>;
}