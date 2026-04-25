import cron, { ScheduledTask } from 'node-cron';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IOrderRepository } from '@application/interfaces/repositories/stock/order-repository.interface';
import { IOrderQueue } from '@application/interfaces/services/stocks/order-queue.interface';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';

@injectable()
export class LimitOrderScheduler {
    private cronJob: ScheduledTask | null = null;

    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.OrderQueue) private readonly _orderQueue: IOrderQueue,
    ) { }

    private async execute(): Promise<void> {

        try {
            const pendingOrders = await this._orderRepository.findPendingLimitOrders();

            for (const order of pendingOrders) {
                await this._orderQueue.addLimitOrderJob(order.id as string);
            }
        } catch (error) {
            console.error('[LimitOrderScheduler] Error during execution:', error);
        }
    }

    public start(): void {
        if (this.cronJob) return;

        if (!isIndianMarketOpen()) return;
        // console.log("Limit Order Scheduler started (every minute)");

        this.cronJob = cron.schedule('* * * * *', async () => {
            await this.execute();
        });
    }

    public stop(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            // console.log("Limit Order Scheduler stopped");
        }
    }
}
