import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.service.interface";
import { injectable } from "inversify";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { model } from "./ollama.config";
import { normalizeAIResponse } from "./utils/normalize-response";

@injectable()
export class DetectAgent implements IDetectAgent {

    private readonly systemPrompt = `
        You are an intent classifier.

        Classify the user's message into ONE of these:
        - education
        - suggestion
        - execution

        Respond ONLY with the category name.
    `;

    async detectAgent(message: string): Promise<string> {

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", this.systemPrompt],
            ["human", "{input}"],
        ]);

        const chain = RunnableSequence.from([prompt, model]);
        const response = await chain.invoke({ input: message });
        return normalizeAIResponse(response.content).trim().toLowerCase();
    }
}