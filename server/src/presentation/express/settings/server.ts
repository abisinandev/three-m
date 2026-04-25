import connectDB from "@infrastructure/databases/mongo_db/mongo.db";
import { env } from "@presentation/express/utils/constants/env.constants";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavDailyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-cron.scheduler";
import { CagrUpdateScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/cagr-cron-scheduler";
// import { NavMontlyScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-monthly-scheduler";
// import { NavYearScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-yearly.scheduler";
import { NavAllocationScheduler } from "@infrastructure/providers/cron-scheduler/mutual-fund/nav-allocatation-scheduler";
import { ISocketService } from "@application/interfaces/services/notification/socket-service.interface";
import { NOTIFICATION_TYEPS } from "@infrastructure/inversify_di/features/notification/notification.type";
import http from "http";
import app from "./app";
import { container } from "@infrastructure/inversify_di/container";
// import { IngestDocuments } from "@infrastructure/providers/ai-agents/langchain/RAG/ingest-docs";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { StrategyWorker } from "@infrastructure/providers/algos/queue/workers/strategy.worker";
import { SignalWorker } from "@infrastructure/providers/algos/queue/workers/signal.worker";
import { IStrategyScheduler } from "@application/interfaces/services/algo-trading/strategy-scheduler.interface";
import { OrderWorker } from "@infrastructure/providers/stocks/queue/workers/order.worker";
import { LimitOrderScheduler } from "@infrastructure/providers/stocks/queue/limit-order-scheduler";
import { SlTpOrderWorker } from "@infrastructure/providers/stocks/queue/workers/sl-tp-order.worker";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { SipWorker } from "@infrastructure/providers/sip/queue/workers/sip.worker";
import { SipScheduler } from "@infrastructure/providers/sip/queue/sip.scheduler";
import { SlTpOrderScheduler } from "@infrastructure/providers/stocks/queue/sl-tp-order.scheduler";

const bootstrap = async () => {
  try {
    await connectDB();

    //cron-scheduler 
    NavDailyScheduler();
    CagrUpdateScheduler();
    NavAllocationScheduler();

    // Algo Trading BullMQ system
    container.get<StrategyWorker>(STOCK_TYPES.StrategyWorker);
    container.get<SignalWorker>(STOCK_TYPES.SignalWorker);
    const algoScheduler = container.get<IStrategyScheduler>(STOCK_TYPES.StrategyScheduler);
    algoScheduler.start();

    // Order Execution BullMQ system
    container.get<OrderWorker>(STOCK_TYPES.OrderWorker);
    const limitOrderScheduler = container.get<LimitOrderScheduler>(STOCK_TYPES.LimitOrderScheduler);
    limitOrderScheduler.start();

    // SL/TP Monitor system
    container.get<SlTpOrderWorker>(STOCK_TYPES.SlTpOrderWorker);
    const slTpScheduler = container.get<SlTpOrderScheduler>(STOCK_TYPES.SlTpOrderScheduler);
    slTpScheduler.start();

    // SIP BullMQ system
    container.get<SipWorker>(SIP_TYPES.SipWorker);
    const sipScheduler = container.get<SipScheduler>(SIP_TYPES.SipScheduler);
    sipScheduler.start();

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
