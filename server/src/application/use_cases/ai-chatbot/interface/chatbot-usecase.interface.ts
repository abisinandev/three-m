import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IChatbotUseCase {
    execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?: boolean,
        type?: 'text' | 'confirmation'
    }>;

    getHistory(userId: string): Promise<ChatMessage[]>;
}