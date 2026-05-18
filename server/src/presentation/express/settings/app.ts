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
    origin:
        [
            env.FRONTEND_URL

        ], credentials: true
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

//AppError middleware
app.use(errorMiddleware);

export default app;
