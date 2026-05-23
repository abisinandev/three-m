import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

export interface IAgent {
    readonly name: string;
    handle(input: string, history: ChatMessage[]): Promise<string>;
}
