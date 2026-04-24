import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IPortfolioAgent {
    handle(input: string, history: ChatMessage[], userId: string): Promise<string>;
}