import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { env } from "@presentation/express/utils/constants/env.constants";
import AppError from "@presentation/express/utils/error-handling/app.error";
import { HttpStatusCode } from "axios";
import mongoose from "mongoose";

const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new AppError(
      ErrorMessage.DB_CONNECTION_FAILED,
      HttpStatusCode.InternalServerError,
    );
  }

  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info(`Database connected successfully`);
  } catch (error) {
    console.log(error);
    throw new AppError("DB connection failed", 500);
  }
};

export default connectDB;
