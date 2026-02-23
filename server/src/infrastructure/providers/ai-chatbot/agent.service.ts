import { injectable } from "inversify";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { model } from "./ollama.config";
import { AIMessage, ContentBlock } from "langchain";
import { IAgentService } from "@application/interfaces/services/ai-chatbot/agent-service.interface";

@injectable()
export class AgentService implements IAgentService {

  async generateResponse(systemPrompt: string, userInput: string): Promise<string> {

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", "{input}"]
        ]);

        const chain = RunnableSequence.from([
            prompt,
            model
        ]);

        const response: AIMessage = await chain.invoke({
            input: userInput
        });

        return this.normalizeContent(response.content);
    }

    private normalizeContent(
        content: AIMessage["content"]
    ): string {

        if (typeof content === "string") {
            return content;
        }

        return content
            .map(block => this.extractText(block))
            .join("");
    }

    private extractText(block: ContentBlock | Text): string {

        if ("text" in block && typeof block.text === "string") {
            return block.text;
        }

        if (typeof block === "string") {
            return block;
        }

        return "";
    }
}