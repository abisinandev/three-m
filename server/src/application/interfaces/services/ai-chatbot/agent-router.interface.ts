import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";

export interface IAgentRouter {
    route(agentName: string, input: string, history: ChatMessage[]): Promise<string>;
}
