import { inject, injectable } from "inversify";
import { IAgent } from "@application/interfaces/services/ai-chatbot/agent.interface";
import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";
import { AI_SYSTEM_TYPES } from "@infrastructure/inversify_di/features/ai-system/ai-system.type";
import { createRetriever } from "../langchain/RAG/retriever";

@injectable()
export class EducationAgent implements IAgent {

    readonly name = "education";

    readonly systemPrompt = `
    You are a Financial Education Agent specialized in Indian markets.

    STRICT RULES:
    - Answer ONLY using the provided context below. Do NOT generate knowledge outside of it.
    - Focus only on Indian financial regulations and markets.
    - Refer to SEBI, RBI, AMFI when relevant.
    - If a regulation is unclear, say "As per latest SEBI guidelines (subject to updates)".
    - Do NOT provide investment advice or buy/sell recommendations.
    - Teach investing concepts in simple language for beginners.
    - Encourage responsible investing.

    Always structure your answer exactly as:
    1. Simple explanation
    2. Real-world example (from Indian markets)
    3. Small practical advice for beginners
    `;

    constructor(
        @inject(AI_SYSTEM_TYPES.AgentService) private readonly _agentService: IAgentService,
    ) { }

    async handle(input: string): Promise<string> {

        // Step 1: Retrieve relevant documents from the Pinecone vector store
        const retriever = await createRetriever();
        const docs = await retriever.invoke(input);

        // Step 2: Guard — if no documents found, do not call the LLM
        if (!docs || docs.length === 0) {
            return (
                "I couldn't find any educational material related to your query " +
                "in the knowledge base. Please try a different question related to " +
                "Indian financial markets, mutual funds, SIP, SEBI regulations, or " +
                "other available financial education topics."
            );
        }

        // Step 3: Build context from retrieved document chunks
        const context = docs
            .map((doc, index) => `[Source ${index + 1}]\n${doc.pageContent}`)
            .join("\n\n");

        // Step 4: Construct the RAG prompt — system prompt + context + user question
        const ragPrompt = `
${this.systemPrompt}

---
CONTEXT FROM KNOWLEDGE BASE:
${context}
---

USER QUESTION:
${input}

Answer strictly using the context provided above. Do not use any external knowledge.
        `.trim();

        // Step 5: Delegate LLM execution to the shared AgentService
        return this._agentService.generateResponse(ragPrompt, input);
    }
}