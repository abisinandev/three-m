import { injectable } from "inversify";
import { groqModel } from "@infrastructure/providers/ai-agents/groq.config";
import { IDetectAgent } from "@application/interfaces/services/ai-chatbot/detect-agent.interface";
import { BaseMessageChunk } from "@langchain/core/messages";

export type IntentType =
  | "simple"
  | "education" 
  | "portfolio"
  | "trade";

@injectable()
export class DetectAgent implements IDetectAgent {

  classifyIntent(message: string): IntentType {
    const text = message.toLowerCase().trim();

    const portfolioPatterns = ["my portfolio", "my investments", "my profit", "my loss", "my current value", "portfolio summary"];
    if (portfolioPatterns.some((p) => text.includes(p))) return "portfolio";

    const tradePatterns = ["buy", "sell", "order", "invest in", "trade", "stock list", "best stocks", "recommend", "how is"];
    if (tradePatterns.some((p) => text.includes(p))) return "trade";

    const educationPatterns = [
      /rbi/i, /sip/i, /risk/i, /sweep/i, /compliance/i,
      "should i", "which is better", "how to invest", "strategy", "plan", "compare"
    ];
    if (educationPatterns.some((p) => typeof p === 'string' ? text.includes(p) : p.test(text))) return "education";

    return "simple";
  }

  async directLLM(message: string): Promise<BaseMessageChunk> {
    return await groqModel.invoke([
      {
        role: "system",
        content: "You are a helpful financial educator. Give clear and simple answers.",
      },
      {
        role: "user",
        content: message,
      },
    ]);
  }
}
