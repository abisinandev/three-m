import { injectable } from "inversify";
import { model } from "@infrastructure/providers/ai-agents/ollama.config";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { BaseMessageChunk } from "@langchain/core/messages";

@injectable()
export class DetectAgent implements IDetectAgent {

  classifyIntent(message: string): "simple" | "complex" | "portfolio" {
    const text = message
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    const portfolioPatterns = [
      "my portfolio",
      "my investments",
      "my returns",
      "my profit",
      "my loss",
      "my current value",
      "my xirr",
      "portfolio summary",
      "how is my portfolio",
      "portfolio performance",
      "how much have i invested",
      "how much is my portfolio worth",
      "what is my portfolio",
    ];

    if (portfolioPatterns.some((p) => text.includes(p))) {
      return "portfolio";
    }

    const complexKeywords = [
      "suggest",
      "recommend",
      "best",
      "compare",
      "invest",
      "buy",
      "sell",
      "strategy",
      "plan",
    ];

    const simpleKeywords = ["what", "why", "how", "explain", "define"];

    const strongComplexPatterns = [
      "should i",
      "which is better",
      "how to invest",
      "best way to",
    ];

    let score = 0;

    for (const p of strongComplexPatterns) {
      if (text.includes(p)) score += 3;
    }

    for (const k of complexKeywords) {
      if (text.includes(k)) score += 2;
    }

    for (const k of simpleKeywords) {
      if (text.includes(k)) score -= 1;
    }

    return score > 0 ? "complex" : "simple";
  }


  async directLLM(message: string): Promise<BaseMessageChunk> {
    return await model.invoke([
      {
        role: "system",
        content:
          "You are a helpful financial educator. Give clear and simple answers.",
      },
      {
        role: "user",
        content: message,
      },
    ]);
  }
}
