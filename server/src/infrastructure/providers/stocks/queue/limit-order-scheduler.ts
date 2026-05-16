import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';
import { BaseScheduler } from '../../cron-scheduler/base.scheduler';
import { IDispatchLimitOrdersUseCase } from '@application/use_cases/stock/interfaces/dispatch-limit-orders.interface';

@injectable()
export class LimitOrderScheduler extends BaseScheduler {

    constructor(
        @inject(STOCK_TYPES.DispatchLimitOrdersUseCase) private readonly _dispatchLimitOrders: IDispatchLimitOrdersUseCase,
    ) { 
        super("LIMIT-ORDER-SCHEDULER", "* * * * *");
    }

    protected async execute(): Promise<void> {
        if (!isIndianMarketOpen()) {
            return;
        }

        // logger.info("[LIMIT-ORDER-SCHEDULER] sync started");
        await this._dispatchLimitOrders.execute();
        // logger.info("[LIMIT-ORDER-SCHEDULER] sync completed");
    }
}


