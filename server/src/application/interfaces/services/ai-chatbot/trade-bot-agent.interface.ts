import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";
import { AgentResponse } from "./agent-response.interface";

export interface ITradeBotAgent {
    handle(
        input: string,
        history: ChatMessage[],
        userId: string
    ): Promise<AgentResponse>;
}