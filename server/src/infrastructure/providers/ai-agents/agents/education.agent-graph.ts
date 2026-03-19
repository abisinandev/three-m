import { model } from "../ollama.config";
import { FinancialIntelligentTool } from "../langchain/tools/financial-intelligent";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const EducationAgentGraph = createReactAgent({
    llm: model,
    tools: [
        FinancialIntelligentTool
    ],

    messageModifier: `
        You are a financial educator for Indian markets.

        Rules:
        - Use tools for data or calculations.
        - Stay within SEBI/RBI/AMFI context.
        - No investment advice.

        Format:
        1. Explanation
        2. Indian example
        3. Simple advice
    `
});