import { inject, injectable } from "inversify";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { ITradeBotAgent } from "@application/interfaces/services/ai-chatbot/trade-bot-agent.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";

@injectable()
export class AgentRouter {
    constructor(
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
        @inject(AI_SYSTEM_TYPES.EducationAgent) private readonly _educationAgent: IEducationAgent,
        @inject(AI_SYSTEM_TYPES.PortfolioAgent) private readonly _portfolioAgent: IPortfolioAgent,
        @inject(AI_SYSTEM_TYPES.TradeAgent) private readonly _tradeAgent: ITradeBotAgent,
    ) { }

    async route(userId: string, userInput: string, history: ChatMessage[]): Promise<AgentResponse> {
        const intent = this._detectAgent.classifyIntent(userInput);

        switch (intent) {
            case "portfolio":
                return await this._portfolioAgent.handle(userInput, history, userId);

            case "trade":
                return await this._tradeAgent.handle(userInput, history, userId);

            case "education":
                return await this._educationAgent.handle(userInput, history);

            default:{
                const response = await this._detectAgent.directLLM(userInput);
                return {
                    message: String(response.content),
                    type: 'text'
                };
            }
        }
    }
}
