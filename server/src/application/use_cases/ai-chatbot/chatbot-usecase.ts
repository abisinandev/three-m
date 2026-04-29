import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { AgentRouter } from "@infrastructure/providers/ai-agents/router/agent-router";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatHistoryService) private readonly _chatHistoryService: IChatHistoryService,
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
        @inject(AI_SYSTEM_TYPES.AgentRouter) private readonly _agentRouter: AgentRouter,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _portfolioCacheData: ICacheProvider,
    ) { }

    async execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?: boolean,
        type?: string,
        data?: unknown
    }> {
        const intent = this._detectAgent.classifyIntent(userInput);
        const inputQuery = userInput.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 50);

        if (intent === "education") {
            const cachedResponse = await this._chatHistoryService.findLastAnswer(userId, userInput);
            if (cachedResponse) {
                await this._chatHistoryService.saveMessage(userId, "user", userInput);
                await this._chatHistoryService.saveMessage(userId, "assistant", cachedResponse);
                return { message: cachedResponse, type: 'text' };
            }
        }

        if (intent === "simple") {
            const cacheKey = `ai-cache:personal:${userId}:${inputQuery}`;
            const cachedResponse = await this._portfolioCacheData.get(cacheKey);
            if (cachedResponse) {
                await this._chatHistoryService.saveMessage(userId, "user", userInput);
                await this._chatHistoryService.saveMessage(userId, "assistant", cachedResponse);
                return { message: cachedResponse, type: 'text' };
            }
        }

        const hasPremiumAccess = await this._featureAccess.hasAccess(userId, Features.AI_CHAT_ADVANCED);
        if (!hasPremiumAccess && (intent === "education" || intent === "portfolio" || intent === "trade")) {
            return {
                message: "This advanced feature requires a Premium subscription.",
                upgradeRequired: true
            };
        }

        await this._chatHistoryService.saveMessage(userId, "user", userInput);
        const history = await this._chatHistoryService.getConversationHistory(userId);

        const agentResponse = await this._agentRouter.route(userId, userInput, history);

        let finalMessage = agentResponse.message;
        if (agentResponse.type === 'confirmation' && agentResponse.data && typeof agentResponse.data === 'object') {
            const data = agentResponse.data as { symbol: string, qty: number };
            finalMessage = `I've prepared a Buy Order for **${data.symbol}** (Quantity: ${data.qty}). Please review and confirm to execute.`;
        }

        await this._chatHistoryService.saveMessage(userId, "assistant", finalMessage);

        if (intent === "simple") {
            const cacheKey = `ai-cache:personal:${userId}:${inputQuery}`;
            await this._portfolioCacheData.set(cacheKey, finalMessage, 3600);
        }

        return {
            message: finalMessage,
            type: agentResponse.type,
            data: agentResponse.data
        };
    }

    async getHistory(userId: string): Promise<ChatMessage[]> {
        return this._chatHistoryService.getConversationHistory(userId);
    }
}
