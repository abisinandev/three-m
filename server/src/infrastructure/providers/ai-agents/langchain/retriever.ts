import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { embeddings } from "./ollama.embedded";

export async function getRetriever() {

    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pc.index(
        process.env.PINECONE_INDEX || "financial-regulations"
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex: index }
    );

    return vectorStore.asRetriever({ k: 4 });
}