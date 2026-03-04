// import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { embeddings } from "./ollama.embedded";

// export async function initChromaCollection() {

//     const vectorStore = new Chroma(embeddings, {
//         collectionName: "finance-regulations",
//         url: "http://localhost:8000"
//     });

//     return vectorStore;
// }

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ollama.embedded";

export async function createVectorStore(docs: any[]) {

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const index = pc.index(
    process.env.PINECONE_INDEX || "financial-regulations"
  );

  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    embeddings,
    {
      pineconeIndex: index,
    }
  );

  return vectorStore;
}