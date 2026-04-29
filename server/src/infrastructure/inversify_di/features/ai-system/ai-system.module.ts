import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { IChatHistoryService } from "@application/interfaces/services/ai-chatbot/chat-history-service.interface";
import { ContainerModule } from "inversify";
import { AI_SYSTEM_TYPES } from "./ai-system.type";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { DetectAgent } from "@infrastructure/providers/ai-agents/agents/detect-agent.provider";
import { EducationAgent } from "@infrastructure/providers/ai-agents/agents/education/education-agent.provider";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { PortfolioAgent } from "@infrastructure/providers/ai-agents/agents/portfolio/portfolio-agent.provider";
import { AiChatbotController } from "@presentation/http/controllers/ai-chatbot/ai-chatbot.controller";
import { IChatbotUseCase } from "@application/use_cases/ai-chatbot/interface/chatbot-usecase.interface";
import { ListBestStockUseCase } from "@application/use_cases/ai-chatbot/trade-agent/list-best-stocks.usecase";
import { IListBestStocksUseCase } from "@application/use_cases/ai-chatbot/interface/list-best-stocks.usecase.interface";
import { TradeAgent } from "@infrastructure/providers/ai-agents/agents/trade/trade-agent.provider";
import { BotStockDetailsUseCase } from "@application/use_cases/ai-chatbot/trade-agent/bot-stock-details.usecase";
import { IBotStockDetailsUseCase } from "@application/use_cases/ai-chatbot/interface/bot-stock-details.usecase.interface";
import { ChatbotUseCase } from "@application/use_cases/ai-chatbot/chatbot-usecase";
import { ChatHistoryService } from "@infrastructure/providers/ai-agents/store/chat-histroy.service";
import { ISemanticCacheService } from "@application/interfaces/services/ai-chatbot/semantic-cache-service.interface";
import { SemanticCacheService } from "@infrastructure/providers/ai-agents/semantic-cache/semantic-cache.service";
import { AgentRouter } from "@infrastructure/providers/ai-agents/router/agent-router";
import { ConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/trade-agent/confirm-bot-buy-order-usecase";
import { IConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/interface/confirm-bot-order-usecase.interface";
import { ITradeBotAgent } from "@application/interfaces/services/ai-chatbot/trade-bot-agent.interface";

export const AiSystemModules = new ContainerModule(({ bind }) => {

    bind<IDetectAgent>(AI_SYSTEM_TYPES.DetectAgent).to(DetectAgent);

    bind<IEducationAgent>(AI_SYSTEM_TYPES.EducationAgent).to(EducationAgent);

    bind<IPortfolioAgent>(AI_SYSTEM_TYPES.PortfolioAgent).to(PortfolioAgent);

    bind<IChatHistoryService>(AI_SYSTEM_TYPES.ChatHistoryService).to(ChatHistoryService);

    bind<IChatbotUseCase>(AI_SYSTEM_TYPES.ChatbotUseCase).to(ChatbotUseCase);

    bind<AiChatbotController>(AI_SYSTEM_TYPES.AiChatbotController).to(AiChatbotController);

    bind<ISemanticCacheService>(AI_SYSTEM_TYPES.SemanticCacheService).to(SemanticCacheService);
    
    bind<ITradeBotAgent>(AI_SYSTEM_TYPES.TradeAgent).to(TradeAgent);
    
    bind<IListBestStocksUseCase>(AI_SYSTEM_TYPES.ListBestStockUseCase).to(ListBestStockUseCase);
    
    bind<IBotStockDetailsUseCase>(AI_SYSTEM_TYPES.BotStockDetailsUseCase).to(BotStockDetailsUseCase);
    
    bind<IConfirmBotBuyOrderUseCase>(AI_SYSTEM_TYPES.ConfirmBotBuyOrderUseCase).to(ConfirmBotBuyOrderUseCase);

    bind<AgentRouter>(AI_SYSTEM_TYPES.AgentRouter).to(AgentRouter);
})