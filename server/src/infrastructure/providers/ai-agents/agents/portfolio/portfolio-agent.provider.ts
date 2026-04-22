import { inject, injectable } from "inversify";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { normalizeAIResponse } from "../../utils/normalize-response";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { IPortfolioAgent } from "@application/interfaces/services/ai-chatbot/portfolio-agent.interface";
import { createPortfolioAgentGraph } from "./portfolio-agent-graph";
import { createPortfolioSummaryTool } from "@infrastructure/providers/ai-agents/langchain/tools/portfolio-summary.tool";
import { IPortfolioSummaryUseCase } from "@application/use_cases/portfolio/interfaces/portfolio-summary-usecase.interface";
import { PORTFOLIO_TYPES } from "@infrastructure/inversify_di/features/portfolio/portfolio.types";

@injectable()
export class PortfolioAgent implements IPortfolioAgent {

    readonly name = "portfolio" as const;

    constructor(
        @inject(PORTFOLIO_TYPES.PortfolioSummaryUseCase)
        private readonly _portfolioSummaryUseCase: IPortfolioSummaryUseCase,
    ) { }

    async handle(input: string, history: ChatMessage[], userId: string): Promise<string> {

        const chatHistory = history.map((msg) =>
            msg.role === "user"
                ? new HumanMessage(msg.content)
                : new AIMessage(msg.content)
        );

        const portfolioSummaryTool = createPortfolioSummaryTool(userId, this._portfolioSummaryUseCase);

        const graph = createPortfolioAgentGraph([portfolioSummaryTool]);

        const result = await graph.invoke({
            messages: [
                ...chatHistory,
                new HumanMessage(input),
            ],
        });

        const finalMessage = result.messages[result.messages.length - 1];

        return normalizeAIResponse(finalMessage?.content || "");
    }
}
 