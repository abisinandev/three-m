import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { AgentResponse } from "./agent-response.interface";

export interface IEducationAgent {
    handle(input: string, history: ChatMessage[]): Promise<AgentResponse>;
}

