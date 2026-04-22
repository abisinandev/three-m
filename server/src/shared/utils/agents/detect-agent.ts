import { model } from "@infrastructure/providers/ai-agents/ollama.config";

export function isSimpleQuestion(message: string): boolean {
    const text = message.toLowerCase();

    const complexKeywords = [
        "suggest", "recommend", "best", "compare",
        "which is better", "invest", "buy", "sell",
        "portfolio", "strategy", "plan"
    ];

    if (complexKeywords.some(k => text.includes(k))) {
        return false;
    }

    const simplePatterns = [
        "what", "why", "how", "explain", "define"
    ];

    if (simplePatterns.some(k => text.includes(k))) {
        return true;
    }

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
