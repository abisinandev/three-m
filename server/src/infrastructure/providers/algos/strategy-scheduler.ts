import cron, { ScheduledTask } from 'node-cron';
import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IStrategyQueue } from '@application/interfaces/services/algo-trading/strategy-queue.interface';
import { IStrategyScheduler } from '@application/interfaces/services/algo-trading/strategy-scheduler.interface';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';
import { IGetValidStrategiesUseCase } from '@application/use_cases/algo-trading/interfaces/get-valid-strategies.interface';

@injectable()
export class StrategyScheduler implements IStrategyScheduler {
    private cronJob: ScheduledTask | null = null;

    constructor(
        @inject(STOCK_TYPES.GetValidStrategiesUseCase) private readonly _getValidStrategiesUseCase: IGetValidStrategiesUseCase,
        @inject(STOCK_TYPES.StrategyQueue) private readonly _strategyQueue: IStrategyQueue,
    ) { }

    private async execute(): Promise<void> {

        try {
            const activeStrategies = await this._getValidStrategiesUseCase.execute();

            for (const strategy of activeStrategies) {
                const strategyId = strategy.id as string;

                await this._strategyQueue.addStrategyJob(strategyId);
            }
        } catch (error) {
            console.error('[StrategyScheduler] Error during execution:', error);
        }
    }

    public async start(): Promise<void> {
        if (this.cronJob) return;

        if (!isIndianMarketOpen()) return;

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
