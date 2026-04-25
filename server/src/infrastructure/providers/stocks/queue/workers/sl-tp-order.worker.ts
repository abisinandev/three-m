import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { bullConnection } from '@infrastructure/providers/algos/queue/queue.config';
import { IExecuteSlTpUseCase } from '@application/use_cases/stock/interfaces/execute-sl-tp.interface';

@injectable()
export class SlTpOrderWorker {
    private worker: Worker;

    constructor(
        @inject(STOCK_TYPES.ExecuteSlTpUseCase) private readonly _executeSlTp: IExecuteSlTpUseCase,
    ) {
        this.worker = new Worker(
            'sl-tp-order-queue',
            this.process.bind(this),
            {
                connection: bullConnection,
                concurrency: 5,
                lockDuration: 60000 // 60 seconds
            }
        );

        this.worker.on('failed', (job, err) => {
            console.error(`❌ SL/TP job ${job?.id} failed: ${err.message}`);
        });

        this.worker.on('completed', (job) => {
            // console.log(`✅ SL/TP job ${job.id} processed successfully`);
        });
    }

    private async process(job: Job<{ orderId: string }>) {
        const { orderId } = job.data;

        try {
            if (job.name === 'execute-sl-tp-order') {
                await this._executeSlTp.execute(orderId);
            }
        } catch (error) {
            console.error(`Error in SlTpOrderWorker for job ${job.id}:`, error);
            throw error;
        }
    }
}
