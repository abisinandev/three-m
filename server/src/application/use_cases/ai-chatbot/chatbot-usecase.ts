import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.AgentRouter) private readonly _agentRouter: IAgentRouter,
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
    ) { }

    async execute(userInput: string): Promise<string> {
        const agentType = await this._detectAgent.detectAgent(userInput);
        return this._agentRouter.route(agentType, userInput);
    }
}