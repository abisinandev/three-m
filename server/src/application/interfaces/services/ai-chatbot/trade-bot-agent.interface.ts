import { ChatMessage } from "@langchain/core/messages";

export interface ITradeBotAgent {
    handle(
        input: string,
        history: ChatMessage[],
        userId: string
    ): Promise<string>;
} 