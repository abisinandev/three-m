import { injectable } from "inversify";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { redisClient } from "@infrastructure/providers/redis/redis.provider";

const MAX_MESSAGES = 20;
const TTL_SECONDS = 3600;
const KEY_PREFIX = "chat:conversation";

@injectable()
export class ChatHistoryService implements IChatHistoryService {

    private getKey(userId: string): string {
        return `${KEY_PREFIX}:${userId}`;
    }

    async saveMessage(userId: string, role: "user" | "assistant", content: string): Promise<void> {
        const key = this.getKey(userId);
        const message: ChatMessage = {
            role,
            content,
            timestamp: Date.now(),
        };

        await redisClient.rpush(key, JSON.stringify(message));
        await redisClient.ltrim(key, -MAX_MESSAGES, -1);
        await redisClient.expire(key, TTL_SECONDS);
    }

    async getConversationHistory(userId: string): Promise<ChatMessage[]> {
        const key = this.getKey(userId);
        const raw = await redisClient.lrange(key, 0, -1);
        return raw.map((entry) => JSON.parse(entry) as ChatMessage);
    }

    async clearConversation(userId: string): Promise<void> {
        const key = this.getKey(userId);
        await redisClient.del(key);
    }

    async findLastAnswer(userId: string, query: string): Promise<string | null> {
        const history = await this.getConversationHistory(userId);
        const normalizedQuery = query.trim().toLowerCase();


        for (let i = history.length - 2; i >= 0; i--) {
            if (history[i].role === "user" && history[i].content.trim().toLowerCase() === normalizedQuery) {
                if (history[i + 1] && history[i + 1].role === "assistant") {
                    return history[i + 1].content;
                }
            }
        }
        return null;
    }
}
