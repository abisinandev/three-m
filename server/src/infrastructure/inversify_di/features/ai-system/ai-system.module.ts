import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";
import { IAgent } from "@application/interfaces/services/ai-chatbot/agent.interface";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { ContainerModule } from "inversify";
import { AI_SYSTEM_TYPES } from "./ai-system.type";
import { AgentService } from "@infrastructure/providers/ai-agents/agent.service";
import { AgentRouter } from "@infrastructure/providers/ai-agents/agent-router";
import { EducationAgent } from "@infrastructure/providers/ai-agents/agents/education-agent.service";
import { AiChatbotController } from "@presentation/http/controllers/ai-chatbot/ai-chatbot.controller";
import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { ChatbotUseCase } from "@application/use_cases/ai-chatbot/chatbot-usecase";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";
import { DetectAgent } from "@infrastructure/providers/ai-agents/detect.agents";

export const AiSystemModules = new ContainerModule(({ bind }) => {

    bind<IAgentService>(AI_SYSTEM_TYPES.AgentService).to(AgentService);

    bind<IDetectAgent>(AI_SYSTEM_TYPES.DetectAgent).to(DetectAgent);

    bind<IAgent>(AI_SYSTEM_TYPES.Agent).to(EducationAgent);



    bind<IAgent[]>(AI_SYSTEM_TYPES.AgentList).toDynamicValue((context) =>
        context.getAll<IAgent>(AI_SYSTEM_TYPES.Agent)
    );

    bind<IAgentRouter>(AI_SYSTEM_TYPES.AgentRouter).to(AgentRouter);

    bind<IChatbotUseCase>(AI_SYSTEM_TYPES.ChatbotUseCase).to(ChatbotUseCase);
    bind<AiChatbotController>(AI_SYSTEM_TYPES.AiChatbotController).to(AiChatbotController);
})