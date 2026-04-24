import { Queue } from 'bullmq';
import { injectable } from 'inversify';
import { bullConnection } from '../../algos/queue/queue.config';
import { IOrderQueue } from '@application/interfaces/services/stocks/order-queue.interface';

@injectable()
export class OrderQueue implements IOrderQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue('order-queue', {
            connection: bullConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
            },
        });
    }

    public async addLimitOrderJob(orderId: string): Promise<void> {
        await this.queue.add('execute-limit-order', { orderId });
    }
}
