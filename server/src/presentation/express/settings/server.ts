import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
// import { NavMontlyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-monthly-scheduler";
// import { NavYearScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-yearly.scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";
import { StartSipScheduler } from "@infrastructure/providers/cron-scheduler/sip/sip-process-scheduler";
import { InitSocketConfigs } from "@infrastructure/providers/notification/socket.configs";
import http from "http";
import app from "./app";
import { StrategyWorker } from "@infrastructure/providers/algos/queue/workers/strategy.worker";
import { SignalWorker } from "@infrastructure/providers/algos/queue/workers/signal.worker";
import { StrategyScheduler } from "@infrastructure/providers/algos/queue/strategy-scheduler";
import { IStrategyScheduler } from "@application/interfaces/services/algo-trading/strategy-scheduler.interface";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
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
    container.get<StrategyWorker>(STOCK_TYPES.StrategyWorker);
    container.get<SignalWorker>(STOCK_TYPES.SignalWorker);
    const algoScheduler = container.get<IStrategyScheduler>(STOCK_TYPES.StrategyScheduler);
    algoScheduler.start();

    const server = http.createServer(app);
    InitSocketConfigs(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on PORT: ${env.PORT}`);
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
  }
};

bootstrap();
