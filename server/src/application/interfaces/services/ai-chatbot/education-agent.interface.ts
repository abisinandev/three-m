import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";
import { AgentResponse } from "./agent-response.interface";

export interface IEducationAgent {
    handle(input: string, history: ChatMessage[]): Promise<AgentResponse>;
}

