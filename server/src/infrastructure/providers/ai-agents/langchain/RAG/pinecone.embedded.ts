import { Embeddings } from "@langchain/core/embeddings";
import { pinecone } from "../pinecone-vector-db";

const MODEL = "llama-text-embed-v2";
const DIMENSION = 1024;

class PineconeEmbeddings extends Embeddings {
  constructor() {
    super({});
  }

  private async embed(inputs: string[], inputType: "passage" | "query"): Promise<number[][]> {
    const response = await pinecone.inference.embed({
      model: MODEL,
      inputs,
      // The SDK types `parameters` as Record<string, string>, but the API
      // rejects `dimension` unless it's sent as a JSON number (422 otherwise).
      parameters: {
        input_type: inputType,
        truncate: "END",
        dimension: DIMENSION,
      } as unknown as Record<string, string>,
    });

    return response.data.map((item) => {
      if (!("values" in item) || !item.values) {
        throw new Error("Expected dense embedding values from Pinecone inference");
      }
      return item.values;
    });
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.embed(texts, "passage");
  }

  async embedQuery(text: string): Promise<number[]> {
    const [vector] = await this.embed([text], "query");
    return vector;
  }
}

export const embeddings = new PineconeEmbeddings();
