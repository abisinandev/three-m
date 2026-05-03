import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { bullConnection } from '../../../bullmq/queue.config';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IProcessSignalUseCase } from '@application/use_cases/algo-trading/interfaces/process-signal.interface';
import { SignalJobData } from '@application/interfaces/services/algo-trading/signal-queue.interface';

@injectable()
export class SignalWorker {
    private worker: Worker;

    constructor(
        @inject(STOCK_TYPES.ProcessSignalUseCase) private readonly _processSignalUseCase: IProcessSignalUseCase
    ) {
        this.worker = new Worker(
            'signal-queue',
            this.process.bind(this),
            { 
                connection: bullConnection, 
                concurrency: 2,
                lockDuration: 60000
            }

        );

        this.worker.on('failed', (job, err) => {
            console.error(`❌ Signal job ${job?.id} failed: ${err.message}`);
        });

        this.worker.on('completed', (job) => {
            console.log(`✅ Signal job ${job.id} processed successfully`);
        });
    }

    private async process(job: Job<SignalJobData>) {
        console.log(`Processing signal for ${job.data.symbol}`);

        try {
            await this._processSignalUseCase.execute(job.data);
        } catch (error) {
            console.error(`Error in SignalWorker for signal ${job.id}:`, error);
            throw error;
        }
    }
}
