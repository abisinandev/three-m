import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { bullConnection } from '@infrastructure/providers/bullmq/queue.config';
import { IProcessOrderJobUseCase } from '@application/use_cases/stock/interfaces/process-order-job.interface';

@injectable()
export class OrderWorker {
    private worker: Worker;

    constructor(
        @inject(STOCK_TYPES.ProcessOrderJobUseCase) private readonly _processOrderJob: IProcessOrderJobUseCase
    ) {
        this.worker = new Worker(
            'order-queue',
            this.process.bind(this),
            { 
                connection: bullConnection, 
                concurrency: 5,
                lockDuration: 60000 // 60 seconds
            }
        );

        this.worker.on('failed', (job, err) => {
            console.error(`❌ Order job ${job?.id} failed: ${err.message}`);
        }); 

        this.worker.on('completed', (job) => {
            console.log(`✅ Order job ${job.id} processed successfully`);
        });
    }

    private async process(job: Job<{ orderId: string }>) {
        const { orderId } = job.data;
        await this._processOrderJob.execute(job.name, orderId);
    }
}
