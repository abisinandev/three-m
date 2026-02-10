import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import app from "./app";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
import { NavMontlyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-monthly-scheduler";
import { NavYearScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-yearly.scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";
import { startSipScheduler } from "@infrastructure/providers/cron-scheduler/sip/sip-process-scheduler";
import { initSocketConfigs } from "@infrastructure/providers/notification/socket.configs";
import http from "http";

const bootstrap = async () => {
  try {
    await connectDB();

    //cron-scheduler
    NavDailyScheduler();
    NavMontlyScheduler();
    NavYearScheduler();
    CagrUpdateScheduler();
    NavAllocationScheduler();
    startSipScheduler();

    const server = http.createServer(app);
    initSocketConfigs(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on PORT: ${env.PORT}`);
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
  }
};

bootstrap();
