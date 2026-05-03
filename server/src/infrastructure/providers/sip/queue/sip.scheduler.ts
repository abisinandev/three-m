import { bullConnection } from '@infrastructure/providers/bullmq/queue.config';
import { Queue } from 'bullmq';
import { injectable } from 'inversify';

@injectable()
export class SipScheduler {
    private queue: Queue;

    constructor() {
        this.queue = new Queue('sip-execution-queue', {
            connection: bullConnection
        });
    }

    public async start(): Promise<void> {
        // Run every day at 6:00 AM and 9:00 AM
        await this.queue.add(
            'execute-due-sips',
            {},
            {
                repeat: {
                    pattern: '0 6,9 * * *',
                },
                jobId: 'sip-repeatable-job'
            }
        );
    }
}
