import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { directLLM, isSimpleQuestion } from "@shared/utils/agents/detect-agent";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { generateCacheKey } from "@shared/utils/agents/generate-cache-key";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatHistoryService) private readonly _chatHistoryService: IChatHistoryService,
        @inject(AI_SYSTEM_TYPES.EducationAgent) private readonly _educationAgent: IEducationAgent,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cacheProvider: ICacheProvider,
    ) { }

    async execute(userId: string, userInput: string): Promise<string> {

        const cacheKey = generateCacheKey(userInput);
        const cached = await this._cacheProvider.get(cacheKey);
        if (cached) return cached;

        const [_, history] = await Promise.all([
            this._chatHistoryService.saveMessage(userId, "user", userInput),
            this._chatHistoryService.getConversationHistory(userId)
        ]);

        let response: string;

        if (isSimpleQuestion(userInput)) {
            response = String((await directLLM(userInput)).content);
        } else {
            response = await this._educationAgent.handle(userInput, history);
        }

        const ttl = 3500 as const;
        await Promise.all([
            this._chatHistoryService.saveMessage(userId, "assistant", response),
            this._cacheProvider.set(cacheKey, response, ttl)
        ]);
        
        return response;
    }

    async getHistory(userId: string): Promise<ChatMessage[]> {
        return this._chatHistoryService.getConversationHistory(userId);
    }


}


