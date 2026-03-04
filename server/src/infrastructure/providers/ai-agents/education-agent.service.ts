import { inject, injectable } from "inversify";
import { IEducationAgentService } from "@application/interfaces/services/ai-chatbot/education-service-usecase.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";
import { getRetriever } from "./langchain/retriever";

@injectable()
export class EducationAgentService implements IEducationAgentService {

    private readonly systemPrompt = `
    You are a Financial Education Agent specialized in Indian markets.

    Your role:
    - Focus only on Indian regulations.
    - Refer to SEBI, RBI, AMFI when relevant.
    - If regulation unclear, say "As per latest SEBI guidelines (subject to updates)".
    - Do not provide investment advice. Only educational explanation.
    - Be structured.
    - Teach investing concepts in simple language.
    - Explain trading, mutual funds, SIP, risk, portfolio basics.
    - Give examples from Indian market.
    - Do NOT give direct buy/sell recommendations.
    - Encourage responsible investing.
    - Answer clearly for beginners.

    Always structure answer:
    1. Simple explanation
    2. Real-world example
    3. Small practical advice
    `;

    constructor(
        @inject(AI_SYSTEM_TYPES.AgentService) private readonly _agentService: IAgentService,
    ) { }

    // async getResponses(userInput: string): Promise<string> {
    //     return this._agentService.generateResponse(
    //         this.systemPrompt,
    //         userInput
    //     );
    // }

    async getResponses(userInput: string): Promise<string> {

        const retriever = await getRetriever();

        const docs = await retriever._getRelevantDocuments(userInput);
        console.log("Retrieval: ", docs);
        
        const context = docs.map(d => d.pageContent).join("\n");

        const prompt = `
            ${this.systemPrompt}

            Context:
            ${context}

            User Question:
            ${userInput}

            Answer only using the provided context.
            `;

        return this._agentService.generateResponse(
            prompt,
            userInput
        );
    }
}