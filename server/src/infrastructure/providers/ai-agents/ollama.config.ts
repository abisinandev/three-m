import { ChatOllama } from "@langchain/ollama";

// Initialize LLM Configuration
export const getOllamaModel = () => {
    return new ChatOllama({
        model: "phi3:mini",
        temperature: 0.3,
        numPredict: 150,   
        topK: 20,
        topP: 0.9,
        repeatPenalty: 1.1,
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
};

export const model = getOllamaModel();