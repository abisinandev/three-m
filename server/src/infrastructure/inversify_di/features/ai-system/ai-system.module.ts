import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { IAgentRouter } from "@application/interfaces/services/ai-chatbot/agent-router.interface";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ContainerModule } from "inversify";
import { AI_SYSTEM_TYPES } from "./ai-system.type";
// import { AgentRouter } from "@infrastructure/providers/ai-agents/agent-router";
import { EducationAgent } from "@infrastructure/providers/ai-agents/agents/education-agent.provider";
import { AiChatbotController } from "@presentation/http/controllers/ai-chatbot/ai-chatbot.controller";
import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { ChatbotUseCase } from "@application/use_cases/ai-chatbot/chatbot-usecase";
import { ChatHistoryService } from "@infrastructure/providers/ai-agents/store/chat-histroy.service";

export const AiSystemModules = new ContainerModule(({ bind }) => {

    bind<IEducationAgent>(AI_SYSTEM_TYPES.EducationAgent).to(EducationAgent);

    // bind<IAgentRouter>(AI_SYSTEM_TYPES.AgentRouter).to(AgentRouter);

    bind<IChatHistoryService>(AI_SYSTEM_TYPES.ChatHistoryService).to(ChatHistoryService);

    bind<IChatbotUseCase>(AI_SYSTEM_TYPES.ChatbotUseCase).to(ChatbotUseCase);

    bind<AiChatbotController>(AI_SYSTEM_TYPES.AiChatbotController).to(AiChatbotController);
})