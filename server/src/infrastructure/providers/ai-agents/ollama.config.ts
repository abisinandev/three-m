import { ChatOllama } from "@langchain/ollama";

// Initialize LLM Configuration
export const getOllamaModel = () => {
    return new ChatOllama({
        model: process.env.OLLAMA_MODEL || "mistral",
        temperature: Number(process.env.OLLAMA_TEMPERATURE) || 0.7,
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
};

export const model = getOllamaModel();