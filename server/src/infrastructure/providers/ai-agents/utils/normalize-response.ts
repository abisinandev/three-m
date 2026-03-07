import { AIMessage } from "@langchain/core/messages";

/**
 * Extracts a plain string from an AIMessage response content.
 * Handles both string content and structured content blocks.
 */
export function normalizeAIResponse(content: AIMessage["content"]): string {
    if (typeof content === "string") {
        return content;
    }

    return content
        .map((block) => {
            if (typeof block === "string") return block;
            if ("text" in block && typeof block.text === "string") return block.text;
            return "";
        })
        .join("");
}
