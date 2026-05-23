import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IAgentRouter {
    route(agentName: string, input: string, history: ChatMessage[]): Promise<string>;
}
