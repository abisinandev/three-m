import { IAgent } from "./agent.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IEducationAgent extends IAgent {
    handle(input: string, history: ChatMessage[]): Promise<string>;
}

