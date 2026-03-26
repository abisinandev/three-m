// import { SyncStocksUseCase } from '@application/use_cases/stock/sync-stock.usecase';
// import { container } from '@infrastructure/inversify_di/container';
// import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
// import cron from 'node-cron';

// export function SyncStocksScheduler() {
//     cron.schedule(
//         "* * * * *", 
//         // "0 3 * * *",
//         async () => {
//             console.log("[SYNC-STOCKS-CRON] sync started");

//             try {
//                 const useCase = container.get<SyncStocksUseCase>(STOCK_TYPES.SyncStocksUseCase);
//                 await useCase.execute();

//                 console.log("[SYNC-STOCKS-CRON] sync completed");
//             } catch (error) {
//                 console.error("Sync failed", error);
//             }
//         },
//         {
//             timezone: "Asia/Kolkata",
//         }
//     );
// }                  