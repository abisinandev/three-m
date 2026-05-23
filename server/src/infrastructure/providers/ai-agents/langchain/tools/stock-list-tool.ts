import { IListBestStocksUseCase } from "@application/use_cases/ai-chatbot/interface/list-best-stocks.usecase.interface";
import { tool } from "@langchain/core/tools";

export const StockListTool = (listStocks: IListBestStocksUseCase) =>
    tool(
        async () => {
            const stocks = await listStocks.execute();
            if (!stocks.length) return "No featured stocks found at the moment.";

            return stocks.map(s =>
                `${s.name} (${s.symbol}): ₹${s.price ?? 'N/A'}`
            ).join("\n");
        },
        {
            name: "list_best_stocks",
            description: "Lists featured or 'best' recommended stocks for the user. Use this when the user asks for stock recommendations or wants to see available stocks to invest in."
        }
    );