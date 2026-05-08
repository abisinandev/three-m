import { ChatGroq } from "@langchain/groq";
import { env } from "@presentation/express/utils/constants/env.constants";

export const getGroqModel = () => {
    return new ChatGroq({
        apiKey: env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        maxTokens: 1024,
    });
};

export const groqModel = getGroqModel();
