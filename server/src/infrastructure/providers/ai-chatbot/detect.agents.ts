import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { inject, injectable } from "inversify";

@injectable()
export class DetectAgent implements IDetectAgent {

    constructor(
        @inject(AI_SYSTEM_TYPES.AgentService) private agentService: IAgentService
    ) { }

    async detectAgent(message: string): Promise<string> {

        const systemPrompt = `
            You are an intent classifier.

            Classify the user's message into ONE of these:
            - education
            - suggestion
            - execution

            Respond ONLY with the category name.
            `;

        const result = await this.agentService.generateResponse(systemPrompt, message);
        return result.trim().toLowerCase();
    }
}