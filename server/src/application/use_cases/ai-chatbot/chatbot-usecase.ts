import { inject, injectable } from "inversify";
import { IChatbotUseCase } from "./interface/chatbot-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IEducationAgentService } from "@application/interfaces/services/ai-chatbot/education-service-usecase.interface";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";

@injectable()
export class ChatbotUseCase implements IChatbotUseCase {
    constructor(
        @inject(AI_SYSTEM_TYPES.EducationAgentService) private readonly _educationService: IEducationAgentService,
        @inject(AI_SYSTEM_TYPES.DetectAgent) private readonly _detectAgent: IDetectAgent,
    ) { }

    async execute(userInput: string): Promise<string> {

        const agentType = await this._detectAgent.detectAgent(userInput);
        console.log("Agnent: ", agentType);
        
        switch (agentType) {
            case "education":
                return this._educationService.getResponses(userInput);

            // case "suggestion":
            //     return this.suggestionUseCase.execute(message);

            // case "execution":
            //     return this.executionUseCase.execute(message);

            default:
                return "Nothing............."
        }
    }
} 