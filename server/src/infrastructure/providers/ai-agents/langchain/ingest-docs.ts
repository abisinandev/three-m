import fs from "fs";
import path from "path";
import { loadPDF } from "./document-loader";
import { splitPdfText } from "./text-splitter";
import { createVectorStore } from "./vector-db";

export async function IngestDocuments() {

    const folder = "./src/infrastructure/providers/ai-agents/datas"

    const files = fs.readdirSync(folder);

    let docs: any[] = [];

    for (const file of files) {

        const filePath = path.join(folder, file);

        const text = await loadPDF(filePath);

        const chunks = await splitPdfText(text);

        docs.push(...chunks);
    }

    await createVectorStore(docs);

    console.log("Documents embedded successfully");
}

// ingest();