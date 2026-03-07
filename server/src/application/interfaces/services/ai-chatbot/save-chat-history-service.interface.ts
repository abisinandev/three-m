export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    time: number;
}
export interface IRedisChatService {

    saveMessage(
        userId: string,
        role: "user" | "assistant",
        content: string
    ): Promise<void>;

    getChatHistory(userId: string): Promise<ChatMessage[]>;

    clearChat(userId: string): Promise<void>;
}