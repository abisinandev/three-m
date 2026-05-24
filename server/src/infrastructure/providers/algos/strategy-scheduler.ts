import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { IStrategyScheduler } from '@application/interfaces/services/algo-trading/strategy-scheduler.interface';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';
import { IStrategiesUseCase } from '@application/use_cases/algo-trading/interfaces/get-valid-strategies.interface';
import { BaseScheduler } from '../cron-scheduler/base.scheduler';

@injectable()
export class StrategyScheduler extends BaseScheduler implements IStrategyScheduler {

    constructor(
        @inject(STOCK_TYPES.StrategiesUseCase) private readonly _getValidStrategiesUseCase: IStrategiesUseCase,
    ) {
        super("STRATEGY-SCHEDULER", "* * * * *");
    }

    protected async execute(): Promise<void> {
        // if (!isIndianMarketOpen()) {
        //     return;
        // }

        // logger.info("[STRATEGY-SCHEDULER] sync started");
        await this._getValidStrategiesUseCase.execute();
        // logger.info("[STRATEGY-SCHEDULER] sync completed");
    }
}


