// import { IStrategyService } from "@application/interfaces/services/algo-trading/strategy-service.interface";
// import { container } from "@infrastructure/inversify_di/container";
// import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";

// /**
//  * @deprecated This engine runner used setInterval and has been replaced by BullMQ queues.
//  * Use StrategyQueue and StrategyWorker instead.
//  */
// export function createEngineRunner(intervalMs = 3000) {
//   const strategyService =
//     container.get<IStrategyService>(STOCK_TYPES.StrategyService);

//   let intervalId: NodeJS.Timeout | null = null;
//   let isRunning = false;

//   const execute = async () => {
//     if (isRunning) return;

//     isRunning = true;

//     try {
//       await strategyService.run();
//     } catch (err) {
//       console.error("❌ Engine error:", err);
//     } finally {
//       isRunning = false;
//     }
//   };

//   const start = () => {
//     if (intervalId) return;

//     console.log(`🚀 Engine started (interval: ${intervalMs}ms)`);
//     intervalId = setInterval(execute, intervalMs);
//   };

//   const stop = () => {
//     if (!intervalId) return;

//     clearInterval(intervalId);
//     intervalId = null;
//     console.log("🛑 Engine stopped");
//   };

//   return { start, stop };
// }