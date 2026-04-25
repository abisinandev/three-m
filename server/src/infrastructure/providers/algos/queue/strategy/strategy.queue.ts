import { Queue } from 'bullmq';
import { injectable } from 'inversify';
import { bullConnection } from '../../../bullmq/queue.config';
import { IStrategyQueue } from '@application/interfaces/services/algo-trading/strategy-queue.interface';

@injectable()
export class StrategyQueue implements IStrategyQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue("strategy-queue", { connection: bullConnection });
    }

    async addStrategyJob(strategyId: string): Promise<void> {
        await this.queue.add('evaluate-strategy', { strategyId }, {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        });
    }
}
