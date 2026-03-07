import { injectable } from "inversify";
import { IEducationAgent } from "@application/interfaces/services/ai-chatbot/education-agent.interface";
import { ChatMessage } from "@application/interfaces/models/chat-message.interface";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { normalizeAIResponse } from "../utils/normalize-response";
import { EducationAgentGraph } from "./education.agent-graph";

@injectable()
export class EducationAgent implements IEducationAgent {

    readonly name = "education" as const;

    async handle(input: string, history: ChatMessage[]): Promise<string> {

        const chatHistory = history.map((msg) =>
            msg.role === "user"
                ? new HumanMessage(msg.content)
                : new AIMessage(msg.content)
        );

        const result = await EducationAgentGraph.invoke({
            messages: [
                ...chatHistory,
                new HumanMessage(input),
            ],
        });

        const finalMessage = result.messages[result.messages.length - 1]

        return normalizeAIResponse(finalMessage?.content || "");
    }
} 