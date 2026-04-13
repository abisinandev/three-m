import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IChatbotUseCase {
    execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?:boolean
    }>;
    getHistory(userId: string): Promise<ChatMessage[]>;
}