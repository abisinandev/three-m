import { IAgent } from "./agent.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IEducationAgent extends IAgent {
    readonly name: "education";
    handle(input: string, history: ChatMessage[]): Promise<string>;
}

