import { ErrorMessages } from "@shared/constants/error.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { env } from "@presentation/express/utils/constants/env.constants";
import AppError from "@presentation/express/utils/error-handling/app.error";
import mongoose from "mongoose";

const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new AppError(
      ErrorMessages.DB.CONNECTION_FAILED,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  try {
    const connect = await mongoose.connect(env.MONGO_URI, {
      dbName: env.DB_NAME
    });
    logger.info(`Database connected successfully, ${connect.connection.db, connect.connection.host}`);
  } catch (error) {
    console.log(error);
    throw new AppError("DB connection failed", 500);
  }
};

export default connectDB;
