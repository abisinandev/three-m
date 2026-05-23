import { injectable, inject } from 'inversify';
import { STOCK_TYPES } from '@infrastructure/inversify_di/features/stock/stock.types';
import { isIndianMarketOpen } from '@shared/utils/market/market-time';
import { BaseScheduler } from '../../cron-scheduler/base.scheduler';
import { IDispatchSlTpOrdersUseCase } from '@application/use_cases/stock/interfaces/dispatch-sl-tp-orders.interface';
// import { logger } from '../../logger/pino.logger';

@injectable()
export class SlTpOrderScheduler extends BaseScheduler {

    constructor(
        @inject(STOCK_TYPES.DispatchSlTpOrdersUseCase) private readonly _dispatchSlTpOrders: IDispatchSlTpOrdersUseCase,
    ) {
        super("SL-TP-ORDER-SCHEDULER", "* * * * *");
    }

    protected async execute(): Promise<void> {
        if (!isIndianMarketOpen()) {
            return;
        }

        // logger.info("[SL-TP-ORDER-SCHEDULER] sync started");
        await this._dispatchSlTpOrders.execute();
        // logger.info("[SL-TP-ORDER-SCHEDULER] sync completed");
    }
}


