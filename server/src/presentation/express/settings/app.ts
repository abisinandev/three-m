import { errorMiddleware } from "@presentation/express/middlewares/error-middleware";
import { env } from "@presentation/express/utils/constants/env.constants";
import { RegisterRoutes } from "@presentation/http/routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

//Middlewares configs
app.use(morgan("dev"));
app.use(cors({
    origin: [
        env.FRONTEND_URL_DEV,
        env.FRONTEND_URL_PRODUCION,
    ],
    credentials: true
}));
app.use(helmet());

//Stripe webhook
import webhookRoutes from "@presentation/http/routes/user/webhook.routes";
import { CommonRoutes } from "@shared/routes/common.routes";
app.use(CommonRoutes.WEBHOOK_ROUTE, webhookRoutes);

app.use(cookieParser());
app.use(express.json());

//Protected routes
RegisterRoutes(app);

//Health checker
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

//AppError middleware
app.use(errorMiddleware);


app.get("/health", async (_req, res) => {
    try {
        res.status(200).json({
            success: true,
            uptime: process.uptime(),
            timestamp: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
        });
    }
});

export default app;
