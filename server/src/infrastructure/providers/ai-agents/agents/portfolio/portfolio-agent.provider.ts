import { inject, injectable } from "inversify";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessage } from "@infrastructure/databases/mongo_db/models/interfaces/chat/chat-message.interface";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { groqModel } from "../../groq.config";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";

@injectable()
export class PortfolioAgent implements IPortfolioAgent {

    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioSummaryUseCase)
        private readonly _portfolioSummaryUseCase: IPortfolioSummaryUseCase,
    ) { }

    async handle(input: string, _history: ChatMessage[], userId: string): Promise<AgentResponse> {

        logger.info("PORTFOLIO AGENT WORKING...");

        const summary = await this._portfolioSummaryUseCase.execute(userId);

        const prompt = `
            Summarize the user's portfolio data in a clear, structured format using bullet points.
            Use bold text for key metrics and headings to make it easy to read at a glance.
            
            IMPORTANT: Always use the Indian Rupee symbol (₹) for all currency values. Do NOT use dollars ($).

            PORTFOLIO DATA:
            - Total Funds: ${summary.totalCount}
            - Total Invested: ₹${summary.totalInvestment.toFixed(2)}
            - Current Value: ₹${summary.currentValue.toFixed(2)}
            - Total Profit: ₹${summary.totalProfit.toFixed(2)}
            - Profit from Sells: ₹${summary.profitAfterSell.toFixed(2)}
            - Total Returns: ₹${summary.totalReturns.toFixed(2)}
            - Return Percentage: ${summary.profitPercentage.toFixed(2)}%
            - XIRR: ${summary.xirr !== null ? `${summary.xirr.toFixed(2)}%` : "Insufficient data for XIRR calculation"}

            USER QUESTION: ${input}
        `;

        const response = await groqModel.invoke([
            new SystemMessage("You are a helpful portfolio assistant for Indian investors. Always use ₹ for currency."),
            new HumanMessage(prompt)
        ]);

        return {
            message: String(response.content),
            type: 'portfolio_summary',
            data: summary
        };
    }
}