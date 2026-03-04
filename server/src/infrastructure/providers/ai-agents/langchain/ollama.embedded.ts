// import { OllamaEmbeddings } from "@langchain/ollama";

import { OllamaEmbeddings } from "@langchain/ollama";

// export const getEmbeddings = () => {
//     return new OllamaEmbeddings({
//         model: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
//         baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434"
//     });
// };

// export const embeddings = getEmbeddings();


export const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text"
});