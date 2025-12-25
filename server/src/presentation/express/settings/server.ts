import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import app from "./app";
import { logger } from "@infrastructure/providers/logger/pino.logger";

const bootstrap = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.info(`Server running on PORT: ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Server startup failed: ${error}`);
    process.exit(1);
  }
};

bootstrap();
