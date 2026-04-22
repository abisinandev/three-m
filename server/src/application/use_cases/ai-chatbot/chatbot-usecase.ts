import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { directLLM, isSimpleQuestion } from "@shared/utils/agents/detect-agent";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { SUBSCRIPTION_TYPES } from "@infrastructure/inversify_di/features/subscription/subscription.types";
import { IFeatureAccessService } from "@application/interfaces/services/subscription/feature-access-service.interface";
import { Features } from "@domain/entities/subscription/enums/features.enum";
import { ISemanticCacheService } from "@application/interfaces/services/ai-chatbot/semantic-cache-service.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.ChatHistoryService) private readonly _chatHistoryService: IChatHistoryService,
        @inject(AI_SYSTEM_TYPES.EducationAgent) private readonly _educationAgent: IEducationAgent,
        @inject(AI_SYSTEM_TYPES.SemanticCacheService) private readonly _semanticCache: ISemanticCacheService,
        @inject(SUBSCRIPTION_TYPES.FeatureAccessService) private readonly _featureAccess: IFeatureAccessService,
    ) { }

    async execute(userId: string, userInput: string): Promise<{
        message: string,
        upgradeRequired?: boolean
    }> {

        const cachedResponse = await this._semanticCache.get(userInput);
        if (cachedResponse) {

            await this._chatHistoryService.saveMessage(userId, "user", userInput);
            await this._chatHistoryService.saveMessage(userId, "assistant", cachedResponse);
            return { message: cachedResponse };
        }

        this._chatHistoryService.saveMessage(userId, "user", userInput)

        let response: string;

        const hasPremiumAccess = await this._featureAccess.hasAccess(userId, Features.AI_CHAT_ADVANCED);

        if (!hasPremiumAccess) {
            if (!isSimpleQuestion(userInput)) {
                return {
                    message: "This question requires advanced AI analysis. Upgrade to Premium to unlock deep research, portfolio recommendations, and full AI capabilities.",
                    upgradeRequired: true
                };
            }

            response = String((await directLLM(userInput)).content);

            await Promise.all([
                this._chatHistoryService.saveMessage(userId, "assistant", response),
                this._semanticCache.set(userInput, response)
            ]);

            return { message: response };
        }

        if (isSimpleQuestion(userInput)) {
            response = String((await directLLM(userInput)).content);
        } else {
            const history = await this._chatHistoryService.getConversationHistory(userId)
            response = await this._educationAgent.handle(userInput, history);
        }

        await Promise.all([
            this._chatHistoryService.saveMessage(userId, "assistant", response),
            this._semanticCache.set(userInput, response)
        ]);

        return { message: response };
    }

    async getHistory(userId: string): Promise<ChatMessage[]> {
        return this._chatHistoryService.getConversationHistory(userId);
    }
}
