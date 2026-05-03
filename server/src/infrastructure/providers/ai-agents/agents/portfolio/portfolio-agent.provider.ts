import { inject, injectable } from "inversify";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";
import { model } from "../../ollama.config";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";

@injectable()
export class PortfolioAgent implements IPortfolioAgent {

    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioSummaryUseCase)
        private readonly _portfolioSummaryUseCase: IPortfolioSummaryUseCase,
    ) { }

    async handle(input: string, history: ChatMessage[], userId: string): Promise<AgentResponse> {
        const summary = await this._portfolioSummaryUseCase.execute(userId);
        
        const prompt = `
            Summarize this portfolio data friendly and concisely.
            DATA: ${JSON.stringify(summary, null, 2)}
            QUESTION: ${input}
        `;

        const response = await model.invoke([
            new SystemMessage("You format financial data into friendly summaries."),
            new HumanMessage(prompt)
        ]);

        return {
            message: String(response.content),
            type: 'portfolio_summary',
            data: summary
        };
    }
}