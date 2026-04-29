import { injectable } from "inversify";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { model } from "../../ollama.config";
import { FinancialIntelligentTool } from "../../langchain/tools/financial-intelligent";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentResponse } from "@application/interfaces/services/ai-chatbot/agent-response.interface";

@injectable()
export class EducationAgent implements IEducationAgent {

    async handle(input: string, history: ChatMessage[]): Promise<AgentResponse> {
        console.log(`[EducationAgent] Querying Knowledge Base for: ${input}`);

        const context = await FinancialIntelligentTool.invoke({ query: input });

        const prompt = `
            You are a professional financial educator for the Indian market.
            
            STRICT RULES:
            - ANSWER ONLY based on the provided CONTEXT.
            - If context is missing, say you don't know.
            
            CONTEXT:
            ${context}
            
            USER QUESTION:
            ${input}
            
            YOUR RESPONSE:
        `;

        const response = await model.invoke([
            new SystemMessage("You are a strict context-based financial assistant."),
            new HumanMessage(prompt)
        ]);

        return {
            message: String(response.content),
            type: 'text'
        };
    }
}