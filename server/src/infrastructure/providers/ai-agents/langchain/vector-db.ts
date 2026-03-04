import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ollama.embedded";
import { env } from "@presentation/express/utils/constants/env.constants";

export async function createVectorStore(docs: any[]) {

  const pc = new Pinecone({
    apiKey: env.PINECODE_API_KEY!,
  });

  const index = pc.index("financial-regulations");

  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    embeddings,
    {
      pineconeIndex: index,
    }
  );

  return vectorStore;
}