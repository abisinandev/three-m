import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import http from "http";
import app from "./app";
import { startSchedulers } from "@shared/bootstraps/start-schedulers";
import { startWorkers } from "@shared/bootstraps/start-workers";
import { initializeSockets } from "@shared/bootstraps/initialize-socket";

const bootstrap = async () => {
  try {
    await connectDB();

    //start job-schedulers & workers
    await startWorkers();
    await startSchedulers();

    const server = http.createServer(app);

    // Initialize SocketService
    initializeSockets(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on PORT: ${env.PORT}`);
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
  }
};

bootstrap();
