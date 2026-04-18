import cron, { ScheduledTask } from 'node-cron';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IAlgoStrategyRepository } from '@application/interfaces/repositories/algo/algo-strategy-repository.interface';
import { IStrategyQueue } from '@application/interfaces/services/algo-trading/strategy-queue.interface';
import { IStrategyScheduler } from '@application/interfaces/services/algo-trading/strategy-scheduler.interface';

@injectable()
export class StrategyScheduler implements IStrategyScheduler {
    private cronJob: ScheduledTask | null = null;

    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
        @inject(STOCK_TYPES.StrategyQueue) private readonly _strategyQueue: IStrategyQueue,
    ) { }

    private async execute(): Promise<void> {
        const now = new Date();
        console.log(`[StrategyScheduler] Triggered at ${now.toISOString()}`);

        try {
            const activeStrategies = await this._strategyRepository.getAllActive();
            console.log(`[StrategyScheduler] Found ${activeStrategies.length} active strategies`);

            for (const strategy of activeStrategies) {
                const strategyId = strategy.id as string;
                console.log(`[StrategyScheduler] Enqueueing strategy: ${strategyId} (${strategy.symbol})`);
                await this._strategyQueue.addStrategyJob(strategyId);
            }
        } catch (error) {
            console.error('[StrategyScheduler] Error during execution:', error);
        }
    }

    public async start(): Promise<void> {
        if (this.cronJob) return;

        console.log("⏰ Algo Strategy Scheduler started (every minute)");

        // Trigger every minute at the start of the minute (00 seconds)
        this.cronJob = cron.schedule('* * * * *', async () => {
            await this.execute();
        });
    }

    public async stop(): Promise<void> {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            console.log("🛑 Algo Strategy Scheduler stopped");
        }
    }

}
