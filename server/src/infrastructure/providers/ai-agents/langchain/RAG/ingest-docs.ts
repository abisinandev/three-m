import path from "node:path";
import crypto from "node:crypto";

import { embeddings } from "./ollama.embedded";
import { pineconeIndex } from "../pinecone-vector-db";
import { loadTxtFiles } from "./text.loader";

import { Document } from "@langchain/core/documents";

const BATCH_SIZE = 50;

async function upsertBatch(docs: Document[]) {
    const texts = docs.map((d) => d.pageContent);

    const vectors = await embeddings.embedDocuments(texts);

    const records = vectors.map((vector, i) => ({
        id: crypto.randomUUID(),
        values: vector,
        metadata: {
            text: docs[i].pageContent,
            source: docs[i].metadata?.source || "",
            topic: docs[i].metadata?.topic || "",
        }
    }));

    await pineconeIndex.namespace("documents").upsert({
        records
    });
}

async function processInBatches(docs: Document[]) {
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = docs.slice(i, i + BATCH_SIZE);

        console.log(`Processing batch ${i / BATCH_SIZE + 1}`);

        await upsertBatch(batch);
    }
}

function splitKnowledgeBase(content: string): Document[] {

    const sections = content
        .split("========================================")
        .map(section => section.trim())
        .filter(section =>
            section.length > 0 &&
            section.includes("Question:")
        );

    return sections.map((section, index) => {

        const topicMatch = section.match(/Question:\s*(.+)/i);

        const topic = topicMatch
            ? topicMatch[1].trim()
            : `topic-${index}`;

        return new Document({
            pageContent: section,
            metadata: {
                source: "financial-kb",
                topic
            }
        });
    });
}

export async function IngestDocuments() {

    const folderPath = path.join(
        process.cwd(),
        "src/infrastructure/providers/ai-agents/langchain/datas"
    );

    const txtDocs = await loadTxtFiles(folderPath);

    console.log(`Loaded ${txtDocs.length} text files`);

    const splitDocs: Document[] = [];

    for (const doc of txtDocs) {

        const docs = splitKnowledgeBase(doc.pageContent);

        splitDocs.push(...docs);
    }

    console.log(`Created ${splitDocs.length} semantic chunks`);

    console.log("Embedding + uploading to Pinecone...");

    await processInBatches(splitDocs);

    console.log("✅ Documents successfully stored in Pinecone");
}