import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createRetriever } from "../RAG/retriever.js";

const retrieverPromise = createRetriever();

export const FinancialIntelligentTool = tool(
  async ({ query }) => {
    const retriever = await retrieverPromise;

    const docs = await retriever.invoke(query);

    const content = docs.map(d => d.pageContent).join("\n");

    return content || "No relevant financial information found.";
  },
  {
    name: "financial_intelligents",

    description: `
          Search the financial knowledge base for information about:

          - SIP investments
          - Mutual funds
          - SEBI regulations
          - Equity and debt funds
          - Indian financial markets

          Use this tool when the user asks financial knowledge questions.
      `,

    schema: z.object({
      query: z.string().describe("User question about finance")
    }),
  }
);