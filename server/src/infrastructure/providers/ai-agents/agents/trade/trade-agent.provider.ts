import { inject, injectable } from "inversify";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { ITradeBotAgent } from "@application/interfaces/services/ai-chatbot/trade-bot-agent.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IListBestStocksUseCase } from "@application/use_cases/ai-chatbot/interface/list-best-stocks.usecase.interface";
import { IBotStockDetailsUseCase } from "@application/use_cases/ai-chatbot/interface/bot-stock-details.usecase.interface";
import { IConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/interface/confirm-bot-order-usecase.interface";
import { model } from "../../ollama.config";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";

@injectable()
export class TradeAgent implements ITradeBotAgent {

    constructor(
        @inject(AI_SYSTEM_TYPES.ListBestStockUseCase) private readonly _listStocks: IListBestStocksUseCase,
        @inject(AI_SYSTEM_TYPES.BotStockDetailsUseCase) private readonly _botStockDetails: IBotStockDetailsUseCase,
        @inject(AI_SYSTEM_TYPES.ConfirmBotBuyOrderUseCase) private readonly _confirmBotBuyOrder: IConfirmBotBuyOrderUseCase,
    ) { }

    async handle(input: string, history: ChatMessage[], userId: string): Promise<AgentResponse> {
        const lowerInput = input.toLowerCase();

        // 1. Execution Logic
        const executionMatch = input.match(/\b(buy|sell|order|purchase)\b.*\b(\d+)\b.*\b([a-zA-Z]{2,10})\b/i);
        if (executionMatch) {
            const qty = parseInt(executionMatch[2]);
            const symbol = executionMatch[3].toUpperCase();
            
            const result = await this._confirmBotBuyOrder.execute({ userId, symbol, quantity: qty });
            if (result && result.upgrade) {
                return { message: result.message, type: 'text' };
            }
            
            return {
                message: `Prepared order for ${qty} shares of ${symbol}.`,
                type: 'confirmation',
                data: { symbol, qty }
            };
        }

        // 2. Market Info Logic
        if (lowerInput.includes("list") || lowerInput.includes("best")) {
            const stocks = await this._listStocks.execute();
            return {
                message: "Here are some top stock suggestions:",
                type: 'suggestion_list',
                data: stocks
            };
        }

        return {
            message: "I can help you with stocks. Try 'best stocks' or 'Buy 10 AAPL'.",
            type: 'text'
        };
    }
}
