import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { AgentResponse } from "./agent-response.interface";

export interface ITradeBotAgent {
    handle(
        input: string,
        history: ChatMessage[],
        userId: string
    ): Promise<AgentResponse>;
}