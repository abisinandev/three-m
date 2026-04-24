import { inject, injectable } from "inversify";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StockListTool } from "../../langchain/tools/stock-list-tool";
import { StockDetailsTool } from "../../langchain/tools/stock-details.tool";
import { TradeExecutionTool } from "../../langchain/tools/trade-execution.tool";
import { createTradeAgentGraph } from "./trade-agent-graph";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IListBestStocksUseCase } from "@application/use_cases/ai-chatbot/interface/list-best-stocks.usecase.interface";
import { IBotStockDetailsUseCase } from "@application/use_cases/ai-chatbot/interface/bot-stock-details.usecase.interface";

@injectable()
export class TradeAgentProvider implements IPortfolioAgent { 
    constructor(
        @inject(AI_SYSTEM_TYPES.ListBestStockUseCase) private readonly _listStocks: IListBestStocksUseCase,
        @inject(AI_SYSTEM_TYPES.BotStockDetailsUseCase) private readonly _botStockDetails: IBotStockDetailsUseCase,
    ) { }

    async handle(input: string, history: any[], userId: string): Promise<string> {

        const tools = [
            StockListTool(this._listStocks),
            StockDetailsTool(this._botStockDetails),
            TradeExecutionTool()
        ];

        const graph = createTradeAgentGraph(tools);

        const formattedHistory = history.map(msg => 
            msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
        );

        const response = await graph.invoke({
            messages: [...formattedHistory, new HumanMessage(input)]
        });

        const lastMessage = response.messages[response.messages.length - 1];
        return lastMessage.content.toString();
    }
}
 