import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
// import { NavMontlyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-monthly-scheduler";
// import { NavYearScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-yearly.scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";
import { StartSipScheduler } from "@infrastructure/providers/cron-scheduler/sip/sip-process-scheduler";
import { ISocketService } from "@application/interfaces/services/notification/socket-service.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import http from "http";
import app from "./app";
// import { STOCK_TYPES } from "@infrastructure/inversify_di/featur.es/stock/stock.types";
import { container } from "@infrastructure/inversify_di/container";
// import { IngestDocuments } from "@infrastructure/providers/ai-agents/langchain/RAG/ingest-docs";

const bootstrap = async () => {
  try {
    await connectDB();

    //cron-scheduler 
    NavDailyScheduler();
    // NavMontlyScheduler();
    // NavYearScheduler();
    CagrUpdateScheduler();
    NavAllocationScheduler();
    // StartSipScheduler(); 


    //vector-db 
    // IngestDocuments() 
    // SyncStocks()


    // Algo Trading BullMQ system
    // container.get<StrategyWorker>(STOCK_TYPES.StrategyWorker);
    // container.get<SignalWorker>(STOCK_TYPES.SignalWorker);
    // const algoScheduler = container.get<IStrategyScheduler>(STOCK_TYPES.StrategyScheduler);
    // algoScheduler.start();

    const server = http.createServer(app);

    // Initialize SocketService
    const socketService = container.get<ISocketService>(NOTIFICATION_TYEPS.SocketService);
    socketService.init(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on PORT: ${env.PORT}`);
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
  }
};

bootstrap();
