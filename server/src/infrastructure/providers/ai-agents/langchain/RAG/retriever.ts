import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ollama.embedded";
import { pineconeIndex } from "../pinecone-vector-db";

export const getVectorStore = async () => {
  return await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
};

export const createRetriever = async () => {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({ k: 3 });
};