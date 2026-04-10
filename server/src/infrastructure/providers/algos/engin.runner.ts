// import { IEngineRunner } from "@application/interfaces/services/ai-chatbot/engin-runner.interface";
// import { IStrategyService } from "@application/interfaces/services/algo-trading/strategy-service.interface";
// import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
// import { inject, injectable } from "inversify";

import { IStrategyService } from "@application/interfaces/services/algo-trading/strategy-service.interface";
import { container } from "@infrastructure/inversify_di/container";

// @injectable()
// export class EngineRunner implements IEngineRunner {
//     private intervalId: NodeJS.Timeout | null = null;
//     private isRunning = false;
//     private intervalMs: number = 3000

//     constructor(
//         @inject(STOCK_TYPES.StrategyService) private strategyService: IStrategyService,
//     ) { }

//     start() {
//         if (this.intervalId) return;

//         console.log(`🚀 Engine started (interval: ${this.intervalMs}ms)`);

//         this.intervalId = setInterval(() => {
//             this.execute();
//         }, this.intervalMs);
//     }

//     private async execute() {
//         if (this.isRunning) return;

//         this.isRunning = true;

//         try {
//             await this.strategyService.run();
//         } catch (err) {
//             console.error("❌ Engine error:", err);
//         } finally {
//             this.isRunning = false;
//         }
//     }

//     stop() {
//         if (!this.intervalId) return;

//         clearInterval(this.intervalId);
//         this.intervalId = null;

//         console.log("🛑 Engine stopped");
//     }
// }

import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";

export function createEngineRunner(intervalMs = 3000) {
  const strategyService =
    container.get<IStrategyService>(STOCK_TYPES.StrategyService);

  let intervalId: NodeJS.Timeout | null = null;
  let isRunning = false;

  const execute = async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      await strategyService.run();
    } catch (err) {
      console.error("❌ Engine error:", err);
    } finally {
      isRunning = false;
    }
  }; 

  const start = () => {
    if (intervalId) return;

    console.log(`🚀 Engine started (interval: ${intervalMs}ms)`);
    intervalId = setInterval(execute, intervalMs);
  };

  const stop = () => {
    if (!intervalId) return;

    clearInterval(intervalId);
    intervalId = null;
    console.log("🛑 Engine stopped");
  };

  return { start, stop };
}