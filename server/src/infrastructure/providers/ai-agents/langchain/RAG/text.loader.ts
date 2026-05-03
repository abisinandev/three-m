import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";

export async function loadTxtFiles(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    const docs: Document[] = [];

    for (const file of files) {
        if (file.endsWith(".txt")) {
            const fullPath = path.join(folderPath, file);
            const content = fs.readFileSync(fullPath, "utf-8");

            docs.push(
                new Document({
                    pageContent: content,
                    metadata: {
                        source: file,
                    },
                })
            );
        }
    }

    return docs;
}