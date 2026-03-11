import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";
import { IRedisChatMemoryService } from "@application/interfaces/services/ai-chatbot/redis-chat-memory.service.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.AgentRouter) private readonly _agentRouter: IAgentRouter,
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
        @inject(AI_SYSTEM_TYPES.RedisChatMemoryService) private readonly _memory: IRedisChatMemoryService,
    ) { }

    async execute(userId: string, userInput: string): Promise<string> {

        const financeKeywords = [
            "currency",
            "convert",
            "money",
            "investment",
            "sip",
            "mutual fund",
            "sebi",
            "stock"
        ]; 

        const isFinance = financeKeywords.some(k =>
            userInput.toLowerCase().includes(k)
        );

        if (!isFinance) {
            return "I can only help with finance-related questions."
        }

        await this._memory.saveMessage(userId, "user", userInput);

        const history = await this._memory.getConversationHistory(userId);

        const agentType = await this._detectAgent.detectAgent(userInput);

        const response = await this._agentRouter.route(agentType, userInput, history);

        await this._memory.saveMessage(userId, "assistant", response);

        return response;
    }

    async getHistory(userId: string): Promise<ChatMessage[]> {
        return this._memory.getConversationHistory(userId);
    }
}