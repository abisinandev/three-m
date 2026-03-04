import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const getSplitter = () => {
    return new RecursiveCharacterTextSplitter({
        chunkSize: Number(process.env.TEXT_SPLITTER_CHUNK_SIZE) || 1000,
        chunkOverlap: Number(process.env.TEXT_SPLITTER_CHUNK_OVERLAP) || 200,
    });
};

export async function splitPdfText(pdfText: string) {
    if (!pdfText) {
        throw new Error("No text provided to split.");
    }
    const splitter = getSplitter();
    const docs = await splitter.createDocuments([pdfText]);
    return docs;
}

