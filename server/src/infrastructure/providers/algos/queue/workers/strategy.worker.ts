import { Worker, Job } from 'bullmq';
import { injectable, inject } from 'inversify';
import { bullConnection } from '../../../bullmq/queue.config';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IEvaluateStrategyUseCase } from '@application/use_cases/algo-trading/interfaces/evaluate-strategy.interface';
import { ISignalQueue } from '@application/interfaces/services/algo-trading/signal-queue.interface';

@injectable()
export class StrategyWorker {
    private worker: Worker;

    constructor(
        @inject(STOCK_TYPES.EvaluateStrategyUseCase) private readonly _evaluateStrategyUseCase: IEvaluateStrategyUseCase,
        @inject(STOCK_TYPES.SignalQueue) private readonly _signalQueue: ISignalQueue
    ) {

        this.worker = new Worker(
            'strategy-queue',
            this.process.bind(this),
            {
                connection: bullConnection,
                concurrency: 5,
                lockDuration: 60000,
                maxStalledCount: 5,
            }

        );

        this.worker.on('failed', (job, err) => {
            console.error(`❌ Strategy job ${job?.id} failed: ${err.message}`);
        });

        this.worker.on('completed', (job) => {
            console.log(`Strategy job ${job.id} completed`);
        });
    }

    private async process(job: Job) {
        const { strategyId } = job.data;
        console.log(`Evaluating strategy: ${strategyId}`);

        try {
            const result = await this._evaluateStrategyUseCase.execute(strategyId);

            if (result) {
                console.log(`✨ Signal generated for ${result.symbol}: ${result.action}`);
                await this._signalQueue.addSignalJob(result);
            }
        } catch (error) {
            console.error(`Error in StrategyWorker for strategy ${strategyId}:`, error);
            throw error;
        }
    }
}
           