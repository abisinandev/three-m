import { ChatOllama } from "@langchain/ollama";

// Initialize LLM Configuration
export const getOllamaModel = () => {
    return new ChatOllama({
        model: "qwen2.5",
        temperature: 0,
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
};

export const model = getOllamaModel();