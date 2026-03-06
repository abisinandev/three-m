import path from "path";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { embeddings } from "./ollama.embedded";
import { pineconeIndex } from "../pinecone-vector-db";


const BATCH_SIZE = 50;
async function upsertBatch(docs: any[]) {
    const texts = docs.map((d) => d.pageContent);

    const vectors = await embeddings.embedDocuments(texts);

    const records = vectors.map((vector, i) => ({
        id: crypto.randomUUID(),
        values: vector,
        metadata: {
            source: docs[i].metadata?.source || "",
            page: docs[i].metadata?.loc?.pageNumber || 0
        }
    }));

    await pineconeIndex.namespace("documents").upsert({
        records
    });
}

async function processInBatches(docs: any[]) {
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);

        console.log(`Processing batch ${i / BATCH_SIZE + 1}`);

        await upsertBatch(batch);
    }
}

export async function IngestDocuments() {
    const folderPath = path.join(
        process.cwd(),
        "src/infrastructure/providers/ai-agents/langchain/datas"
    );

    const loader = new DirectoryLoader(folderPath, {
        ".pdf": (path: any) => new PDFLoader(path),
    });

    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents`);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Created ${splitDocs.length} chunks`);

    console.log("Embedding + uploading to Pinecone...");

    await processInBatches(splitDocs);
    console.log("✅ Documents successfully stored in Pinecone");
}