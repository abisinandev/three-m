import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IChatbotUseCase {
    execute(userId: string, userInput: string): Promise<string>;
    getHistory(userId: string): Promise<ChatMessage[]>;
}