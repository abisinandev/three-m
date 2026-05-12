import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { MUTUAL_FUND_TYPES } from '@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types';
import { ISyncSingleFundNavUseCase } from '@application/use_cases/mutual-fund/interfaces/sync-single-fund-nav.usecase.interface';
import { bullConnection } from '@infrastructure/providers/bullmq/queue.config';
import { NavInterval } from '@domain/enum/funds/nav-intervals.enums';
import { logger } from '@infrastructure/providers/logger/pino.logger';

@injectable()
export class NavUpdateWorker {
    private worker: Worker;

    constructor(
        @inject(MUTUAL_FUND_TYPES.SyncSingleFundNavUseCase) private readonly _syncSingleFundNav: ISyncSingleFundNavUseCase
    ) {
        this.worker = new Worker(
            'update-navs',
            this.process.bind(this),
            { 
                connection: bullConnection, 
                concurrency: 5,
                lockDuration: 60000 // 60 seconds
            }
        );

        this.worker.on('failed', (job, err) => {
            logger.error({ jobId: job?.id, error: err.message }, "❌ NAV update job failed");
        }); 

        this.worker.on('completed', (job) => {
            logger.info({ jobId: job.id }, "✅ NAV update job processed successfully");
        });
    }

    private async process(job: Job<{ schemeCode: string; interval: NavInterval }>) {
        const { schemeCode, interval } = job.data;
        
        try {
            await this._syncSingleFundNav.execute(schemeCode, interval);
        } catch (error) {
            logger.error({ schemeCode, error }, "Error in NavUpdateWorker");
            throw error;
        }
    }
}
