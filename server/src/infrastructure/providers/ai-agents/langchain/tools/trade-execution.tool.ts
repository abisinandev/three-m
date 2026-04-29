import { IConfirmBotBuyOrderUseCase } from "@application/use_cases/ai-chatbot/interface/confirm-bot-order-usecase.interface";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const TradeExecutionTool = (confirmUseCase: IConfirmBotBuyOrderUseCase, userId: string) =>
    tool(
        async ({ symbol, quantity }) => {
            const result = await confirmUseCase.execute({ userId, symbol, quantity });
            
            if (result && result.upgrade) {
                return result.message;
            }

            return `CONFIRM_TRADE:${symbol}:${quantity}`;
        },
        {
            name: "prepare_trade_order",
            description: "Prepares a stock buy order for user confirmation. Use this when the user expresses a clear intent to buy a specific stock (e.g., 'I want to buy 10 shares of RELIANCE'). This will show a confirmation card to the user.",
            schema: z.object({
                symbol: z.string().describe("The stock symbol to buy"),
                quantity: z.number().positive().describe("The number of shares to purchase")
            })
        }
    );
