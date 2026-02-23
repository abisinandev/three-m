import { inject, injectable } from "inversify";
import { IEducationAgentService } from "@application/interfaces/services/ai-chatbot/education-service-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";

@injectable()
export class EducationAgentService implements IEducationAgentService {

    private readonly systemPrompt = `
    You are a professional Indian finance educator.

    Your role:
    - Teach investing concepts in simple language.
    - Explain trading, mutual funds, SIP, risk, portfolio basics.
    - Give examples from Indian market.
    - Do NOT give direct buy/sell recommendations.
    - Encourage responsible investing.
    - Answer clearly for beginners.

    Always structure answer:
    1. Simple explanation
    2. Real-world example
    3. Small practical advice
    `;

    constructor(
        @inject(AI_SYSTEM_TYPES.AgentService) private readonly _agentService: IAgentService,
    ) { }

    async getResponses(userInput: string): Promise<string> {
        return this._agentService.generateResponse(
            this.systemPrompt,
            userInput
        );
    }
}