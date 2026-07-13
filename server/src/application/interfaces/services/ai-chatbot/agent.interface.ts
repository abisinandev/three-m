import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";

export interface IAgent {
    readonly name: string;
    handle(input: string, history: ChatMessage[]): Promise<string>;
}
