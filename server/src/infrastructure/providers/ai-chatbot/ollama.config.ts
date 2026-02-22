import { ChatOllama } from "@langchain/ollama";

//Initialize LLM
export const model = new ChatOllama({
    model: "mistral",
    temperature: 0.7,
});