import { errorMiddleware } from "@presentation/express/middlewares/error-middleware";
import { env } from "@presentation/express/utils/constants/env.constants";
import { RegisterRoutes } from "@presentation/http/routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";

const app = express();

//Middlewares configs
app.use(morgan("dev"));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(helmet());

//Initialize LLM
const model = new ChatOllama({
    model: "mistral",
    temperature: 0.7,
});


//Stripe webhook
import webhookRoutes from "@presentation/http/routes/user/webhook.routes";
import { CommonRoutes } from "@shared/routes/common.routes";
app.use(CommonRoutes.WEBHOOK_ROUTE, webhookRoutes);

app.use(cookieParser());
app.use(express.json());


app.post("/chat", async (req, res) => {
    try {
        const dto = { ...req.body }
        const response = await model.invoke([
            new HumanMessage(dto?.message),
        ]);

        res.json({ reply: response.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

//Protected routes
RegisterRoutes(app);

//AppError middleware
app.use(errorMiddleware);

export default app;
