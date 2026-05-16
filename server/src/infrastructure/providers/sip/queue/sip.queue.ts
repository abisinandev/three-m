import { Queue } from 'bullmq';
import { injectable } from 'inversify';
import { ISipQueue } from '@application/interfaces/services/sip/sip-queue.interface';
import { bullConnection } from '@infrastructure/providers/bullmq/queue.config';

@injectable()
export class SipQueue implements ISipQueue {
    private queue: Queue;

    constructor() {
        this.queue = new Queue('sip-execution-queue', {
            connection: bullConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
            },
        });
    }

    public async addSipExecutionJob(installmentId: string): Promise<void> {
        await this.queue.add('execute-due-sips', { installmentId }, {
            jobId: installmentId
        });
    }
}
