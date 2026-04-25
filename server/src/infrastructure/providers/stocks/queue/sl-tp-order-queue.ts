import { Queue } from 'bullmq';
import { injectable } from 'inversify';
import { bullConnection } from '../../algos/queue/queue.config';
import { ISlTpOrderQueue } from '@application/interfaces/services/stocks/sl-tp-order-queue.interface';

@injectable()
export class SlTpOrderQueue implements ISlTpOrderQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue('sl-tp-order-queue', {
            connection: bullConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
            },
        });
    }

    public async addSlTpQueue(orderId: string): Promise<void> {
        await this.queue.add('execute-sl-tp-order', { orderId }, { jobId: orderId });
    }

}
