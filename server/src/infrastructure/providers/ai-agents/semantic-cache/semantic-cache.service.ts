import { injectable } from "inversify";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { ISemanticCacheService } from "@application/interfaces/services/ai-chatbot/semantic-cache-service.interface";
import { pineconeIndex } from "../langchain/pinecone-vector-db";
import { embeddings } from "../langchain/RAG/ollama.embedded";

@injectable()
export class SemanticCacheService implements ISemanticCacheService {
    private readonly storePromise: Promise<PineconeStore>;

    constructor() {
        this.storePromise = PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            namespace: "semantic-cache",
        });
    }

    async get(query: string, threshold: number = 0.95): Promise<string | null> {
        try {
            const store = await this.storePromise;
            const results = await store.similaritySearchWithScore(query, 1);

            if (results.length > 0) {
                const [doc, score] = results[0];
                if (score >= threshold && doc.metadata?.response) {
                    return doc.metadata.response as string;
                }
            }
            return null;
        } catch (error) {
            console.error("Semantic Cache get error:", error);
            return null;
        }
    }

    async set(query: string, response: string): Promise<void> {
        if (!query?.trim() || !response?.trim()) {
            return;
        }

        try {
            const store = await this.storePromise;

            await store.addDocuments([
                new Document({
                    pageContent: query,
                    metadata: { response },
                })
            ]);
        } catch (error) {
            console.error("Semantic Cache set error (Non-Fatal):", error);
        }
    }
}
