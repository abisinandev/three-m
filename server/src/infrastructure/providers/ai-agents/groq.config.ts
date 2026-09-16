import { ChatGroq } from "@langchain/groq";
import { env } from "@presentation/express/utils/constants/env.constants";

const GROQ_MODEL_CHAIN = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "groq/compound-mini",
];

const buildGroqModel = (model: string) =>
    new ChatGroq({
        apiKey: env.GROQ_API_KEY,
        model,
        temperature: 0.3,
        maxTokens: 1024,
    });

export const getGroqModel = () => {
    const [primaryModel, ...fallbackModels] = GROQ_MODEL_CHAIN;
    const primary = buildGroqModel(primaryModel);

    if (fallbackModels.length === 0) return primary;

    return primary.withFallbacks(fallbackModels.map(buildGroqModel));
};

export const groqModel = getGroqModel();
