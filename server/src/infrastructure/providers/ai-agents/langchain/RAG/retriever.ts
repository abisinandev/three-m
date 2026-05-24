import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ollama.embedded";
import { pineconeIndex } from "../pinecone-vector-db";

export const getVectorStore = async () => {
  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: "documents",
  });
};

export const createRetriever = async () => {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({
    k: 3, // keep small
    searchType: "similarity", // avoid duplicate chunks
    // searchKwargs: {
    //   fetchK: 6, // fetch more, then filter best 3
    //   lambda: 0.5 // balance relevance vs diversity
    // }
  });
};