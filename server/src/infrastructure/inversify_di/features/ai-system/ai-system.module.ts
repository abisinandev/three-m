import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { IRedisChatMemoryService } from "@application/interfaces/services/ai-chatbot/redis-chat-memory.service.interface";
import { ContainerModule } from "inversify";
import { AI_SYSTEM_TYPES } from "./ai-system.type";
import { AgentRouter } from "@infrastructure/providers/ai-agents/agent-router";
import { EducationAgent } from "@infrastructure/providers/ai-agents/agents/education-agent.provider";
import { RedisChatMemoryService } from "@infrastructure/providers/ai-agents/store/redis-chat-memory.service";
import { AiChatbotController } from "@presentation/http/controllers/ai-chatbot/ai-chatbot.controller";
import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { ChatbotUseCase } from "@application/use_cases/ai-chatbot/chatbot-usecase";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";
import { DetectAgent } from "@infrastructure/providers/ai-agents/detect.agents";

export const AiSystemModules = new ContainerModule(({ bind }) => {

    bind<IDetectAgent>(AI_SYSTEM_TYPES.DetectAgent).to(DetectAgent);

    bind<IEducationAgent>(AI_SYSTEM_TYPES.EducationAgent).to(EducationAgent);

    bind<IAgentRouter>(AI_SYSTEM_TYPES.AgentRouter).to(AgentRouter);

    bind<IRedisChatMemoryService>(AI_SYSTEM_TYPES.RedisChatMemoryService).to(RedisChatMemoryService);

    bind<IChatbotUseCase>(AI_SYSTEM_TYPES.ChatbotUseCase).to(ChatbotUseCase);

    bind<AiChatbotController>(AI_SYSTEM_TYPES.AiChatbotController).to(AiChatbotController);
})