import { Queue } from 'bullmq';
import { injectable } from 'inversify';
import { bullConnection } from './queue.config';
import { ISignalQueue, SignalJobData } from '@application/interfaces/services/algo-trading/signal-queue.interface';

@injectable()
export class SignalQueue implements ISignalQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue('signal-queue', { connection: bullConnection });
    }

    async addSignalJob(data: SignalJobData): Promise<void> {
        await this.queue.add('process-signal', data, {
            removeOnComplete: true,
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
    }
}
 
