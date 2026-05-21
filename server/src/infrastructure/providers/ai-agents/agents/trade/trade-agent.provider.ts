import { inject, injectable } from "inversify";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { ITradeBotAgent } from "@application/interfaces/services/ai-chatbot/trade-bot-agent.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IListBestStocksUseCase } from "@application/use_cases/ai-chatbot/interface/list-best-stocks.usecase.interface";
import { groqModel } from "../../groq.config";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";

import { IStockRepository } from "@application/interfaces/repositories/stock/stock-repository.interface";
import { IMarketDataProvider } from "@application/interfaces/repositories/stock/market-data-provider.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";

@injectable()
export class TradeAgent implements ITradeBotAgent {

    constructor(
        @inject(AI_SYSTEM_TYPES.ListBestStockUseCase) private readonly _listStocks: IListBestStocksUseCase,
        @inject(STOCK_TYPES.StockRepository) private readonly _stockRepository: IStockRepository,
        @inject(STOCK_TYPES.MarketDataProvider) private readonly _marketDataProvider: IMarketDataProvider,
    ) { }

    async handle(input: string, history: ChatMessage[], _userId: string): Promise<AgentResponse> {

        logger.info("TRADE AGENT WORKING...");

        const lowerInput = input.toLowerCase();

        const tradeWords = ["buy", "sell", "order", "purchase", "invest"];
        const isTradeQuery = tradeWords.some(word => lowerInput.includes(word));

        if (isTradeQuery && !lowerInput.includes("list") && !lowerInput.includes("best")) {
            try {

                const extractionPrompt = `
                    Extract the stock symbol and quantity from this trade request.
                    User Request: "${input}"
                    
                    Return ONLY a JSON object like this: {"symbol": "SYMBOL", "quantity": NUMBER}.
                    If quantity is not mentioned, default to 1.
                    If symbol is not found, return {"symbol": null, "quantity": null}.
                `;

                const extractionResponse = await groqModel.invoke(extractionPrompt);
                const data = JSON.parse(String(extractionResponse.content).match(/\{.*\}/s)?.[0] || "{}");

                if (!data.symbol) {
                    return { message: "I couldn't identify which stock you want to trade. Could you please specify the symbol (e.g., 'Buy 1 ITC')?", type: 'text' };
                }

                const action = (input.toLowerCase().includes("sell") || input.toLowerCase().includes("exit")) ? "sell" : "buy";
                const symbol = data.symbol.toUpperCase();
                const qty = data.quantity || 1;

                if (action === "sell") {
                    return {
                        message: `While I can help you discover and buy stocks, **Sell Orders** should be executed through your **Portfolio Dashboard**. \n\nThis allows you to carefully review your investment's growth and overall strategy before making a final decision.`,
                        type: 'text'
                    };
                }

                let stock = await this._stockRepository.findBySymbol(symbol);

                if (!stock && !symbol.endsWith(".NS")) {
                    stock = await this._stockRepository.findBySymbol(`${symbol}.NS`);
                }

                if (!stock) {
                    return { message: `I couldn't find the stock symbol **${symbol}** in our database. Please verify the symbol.`, type: 'text' };
                }

                const finalSymbol = stock.symbol;
                const quote = await this._marketDataProvider.getLatestQuote(finalSymbol);
                const price = quote?.price || 0;

                return {
                    message: `I've prepared a Buy Order for **${qty}** shares of **${finalSymbol}**.`,
                    type: 'confirmation',
                    data: {
                        symbol: finalSymbol,
                        qty,
                        price,
                        total: price * qty,
                        name: stock.name
                    }
                };
            } catch (error) {
                console.error("Trade Agent Extraction Error:", error);
                return { message: "I had trouble understanding that trade request. Could you try saying it like 'Buy 1 ITC'?", type: 'text' };
            }
        }


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
