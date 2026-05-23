import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { IBotStockDetailsUseCase } from "@application/use_cases/ai-chatbot/interface/bot-stock-details.usecase.interface";


export const StockDetailsTool = (botStockDetails: IBotStockDetailsUseCase) =>
    tool(
        async ({ symbol }) => {
            const result = await botStockDetails.execute(symbol);
            if (!result) return `Stock with symbol ${symbol} not found or not available.`;

            return `
                Details for ${result.stock.name} (${symbol}):
                - Current Price: ₹${result.price ?? 'N/A'}
                - 24h Change: ₹${result.change ?? '0'} (${result.changePercent ?? '0'}%)
                - Day High: ₹${result.high ?? 'N/A'}
                - Day Low: ₹${result.low ?? 'N/A'}
            `.trim();
        },
        {
            name: "get_stock_details",
            description: "Fetches real-time price and day performance metrics for a specific stock symbol. Use this when the user asks about a specific stock or wants to see price details before investing.",
            schema: z.object({
                symbol: z.string().describe("The stock ticker symbol (e.g., RELIANCE, TCS)")
            })
        }
    );
