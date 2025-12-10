import { errorMiddleware } from "@presentation/express/middlewares/error-middleware";
import { env } from "@presentation/express/utils/constants/env.constants";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();
  
//middlewares configs
app.use(morgan("dev"));

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//protected routes
import { RegisterRoutes } from "@presentation/http/routes";

RegisterRoutes(app);

//AppError middleware
app.use(errorMiddleware);

export default app;
