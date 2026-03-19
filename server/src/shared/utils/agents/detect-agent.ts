import { model } from "@infrastructure/providers/ai-agents/ollama.config";

export function isSimpleQuestion(message: string): boolean {
    const text = message.toLowerCase();

    // complex intent keywords
    const complexKeywords = [
        "suggest", "recommend", "best", "compare",
        "which is better", "invest", "buy", "sell",
        "portfolio", "strategy", "plan"
    ];

    // if any complex keyword → NOT simple
    if (complexKeywords.some(k => text.includes(k))) {
        return false;
    }

    // question patterns → simple
    const simplePatterns = [
        "what", "why", "how", "explain", "define"
    ];

    if (simplePatterns.some(k => text.includes(k))) {
        return true;
    }

    // fallback
    return true;
}



export async function directLLM(message: string) {
    return await model.invoke([
        {
            role: "system",
            content: "You are a helpful financial educator. Give clear and simple answers."
        },
        {
            role: "user",
            content: message
        }
    ]);
}
