import cron, { ScheduledTask } from 'node-cron';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IOrderRepository } from '@application/interfaces/repositories/stock/order-repository.interface';
import { ISlTpOrderQueue } from '@application/interfaces/services/stocks/sl-tp-order-queue.interface';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';

@injectable()
export class SlTpOrderScheduler {
    private cronJob: ScheduledTask | null = null;

    constructor(
        @inject(STOCK_TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
        @inject(STOCK_TYPES.SlTpOrderQueue) private readonly _slTpOrderQueue: ISlTpOrderQueue,
    ) { }

    private async execute(): Promise<void> {

        try {
            const filledOrders = await this._orderRepository.findFilledOrders() ?? [];

            for (const order of filledOrders) {
                await this._slTpOrderQueue.addSlTpQueue(order.id as string);
            }
        } catch (error) {
            console.error('[SlTp-order] Error during execution:', error);
        }
    }

    public start(): void {
        if (this.cronJob) return;

        if (!isIndianMarketOpen()) return;
        // console.log("SlTp Order Scheduler started (every minute)");

        this.cronJob = cron.schedule('* * * * *', async () => {
            await this.execute();
        });
    }

    public stop(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            // console.log("SlTp Order Scheduler stopped");
        }
    }
}
