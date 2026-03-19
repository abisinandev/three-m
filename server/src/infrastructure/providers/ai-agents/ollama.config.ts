import { ChatOllama } from "@langchain/ollama";

// Initialize LLM Configuration
export const getOllamaModel = () => {
    return new ChatOllama({
        model: "llama3.1",
        temperature: 0,
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
};

export const model = getOllamaModel();