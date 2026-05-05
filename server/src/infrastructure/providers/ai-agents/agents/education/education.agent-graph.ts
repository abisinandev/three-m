import { groqModel } from "../../groq.config";
import { FinancialIntelligentTool } from "../../langchain/tools/financial-intelligent";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const EducationAgentGraph = createReactAgent({
    llm: groqModel,
    tools: [
        FinancialIntelligentTool
    ],

    messageModifier: `
        You are a financial educator for Indian markets.

        Rules:
        - Use tools for data or calculations. DO NOT output the raw tool call JSON to the user.
        - If you need information from the knowledge base, call the 'financial_intelligents' tool.
        - Wait for the tool output before providing the final answer.
        - Stay within SEBI/RBI/AMFI context.
        - No investment advice.

        Format:
        1. Explanation (Natural language only)
        2. Indian example
        3. Simple advice
    `
});