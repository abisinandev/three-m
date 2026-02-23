import { AIMessage, ContentBlock } from "langchain";

export function normalizeContent(
    content: AIMessage["content"]
): string {

    if (typeof content === "string") {
        return content;
    }

    return content
        .map(block => extractText(block))
        .join("");
}

export function extractText(block: ContentBlock | Text): string {

    if ("text" in block && typeof block.text === "string") {
        return block.text;
    }

    if (typeof block === "string") {
        return block;
    }

    return "";
}