import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { ISemanticCacheService } from "@application/interfaces/services/ai-chatbot/semantic-cache-service.interface";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ITradeBotAgent } from "@application/interfaces/services/ai-chatbot/trade-bot-agent.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatHistoryService) private readonly _chatHistoryService: IChatHistoryService,
        @inject(AI_SYSTEM_TYPES.EducationAgent) private readonly _educationAgent: IEducationAgent,
        @inject(AI_SYSTEM_TYPES.PortfolioAgent) private readonly _portfolioAgent: IPortfolioAgent,
        @inject(AI_SYSTEM_TYPES.TradeAgent) private readonly _tradeAgent: ITradeBotAgent,
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
        @inject(AI_SYSTEM_TYPES.SemanticCacheService) private readonly _semanticCache: ISemanticCacheService,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _portfolioCacheData: ICacheProvider,
    ) { }

    async execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?: boolean,
        type?: 'text' | 'confirmation'
    }> {

        const intent = this._detectAgent.classifyIntent(userInput);
        const inputQuery = userInput.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 50);

        if (intent === "complex") {

            const cachedResponse = await this._semanticCache.get(userInput);

            if (cachedResponse) {
                await this._chatHistoryService.saveMessage(userId, "user", userInput);
                await this._chatHistoryService.saveMessage(userId, "assistant", cachedResponse);
                return { message: cachedResponse };
            }

        } else {

            const cacheKey = `ai-cache:personal:${userId}:${inputQuery}`;
            const cachedResponse = await this._portfolioCacheData.get(cacheKey);

            if (cachedResponse) {
                await this._chatHistoryService.saveMessage(userId, "user", userInput);
                await this._chatHistoryService.saveMessage(userId, "assistant", cachedResponse);
                return { message: cachedResponse };
            }
        }

        this._chatHistoryService.saveMessage(userId, "user", userInput)

        let response: string;

        const hasPremiumAccess = await this._featureAccess.hasAccess(userId, Features.AI_CHAT_ADVANCED);

        if (!hasPremiumAccess) {
            if (intent === "complex") {
                return {
                    message: "This question requires advanced AI analysis. Upgrade to Premium to unlock deep research, portfolio recommendations, and full AI capabilities.",
                    upgradeRequired: true
                };
            }

            response = String((await this._detectAgent.directLLM(userInput)).content);

            await Promise.all([
                this._chatHistoryService.saveMessage(userId, "assistant", response),
                this._portfolioCacheData.set(`ai-cache:personal:${userId}:${inputQuery}`, response, 3600)
            ]);

            return { message: response };
        }

        if (intent === "simple") {

            response = String((await this._detectAgent.directLLM(userInput)).content);

        } else if (intent === "portfolio") {

            const history = await this._chatHistoryService.getConversationHistory(userId);
            response = await this._portfolioAgent.handle(userInput, history, userId);

        } else if (intent === "trade") {

            const history = await this._chatHistoryService.getConversationHistory(userId) as any;
            response = await this._tradeAgent.handle(userInput, history, userId as string);

        } else {

            const history = await this._chatHistoryService.getConversationHistory(userId);
            response = await this._educationAgent.handle(userInput, history);

        }

        let isConfirmation = false;
        if (response.includes("CONFIRM_TRADE:")) {
            isConfirmation = true;

            const parts = response.split("CONFIRM_TRADE:")[1].split(":");
            const symbol = parts[0];
            const qty = parts[1];
            response = `I've prepared a Buy Order for **${symbol}** (Quantity: ${qty}). Please review the details below and confirm to execute the trade.`;
        }

        const savePromises = [
            this._chatHistoryService.saveMessage(userId, "assistant", response)
        ];

        if (intent === "complex") {
            savePromises.push(this._semanticCache.set(userInput, response));
        } else {
            const ttl = intent === "portfolio" ? 300 : 3600;
            savePromises.push(this._portfolioCacheData.set(`ai-cache:personal:${userId}:${inputQuery}`, response, ttl));
        }

        await Promise.all(savePromises);

        return {
            message: response,
            type: isConfirmation ? "confirmation" : "text"
        };
    }

    async getHistory(userId: string): Promise<ChatMessage[]> {
        return this._chatHistoryService.getConversationHistory(userId);
    }
}
