import { NavInterval } from '@domain/enum/funds/nav-intervals.enums';
import { injectable, inject } from 'inversify';
import { IMutualFundNavUpdatesUseCase } from '@application/use_cases/mutual-fund/interfaces/mutual-fund-nav-udpate-usecase.interface';
import { MUTUAL_FUND_TYPES } from '@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types';
import { BaseScheduler } from '../base.scheduler';
import { logger } from '@infrastructure/providers/logger/pino.logger';

@injectable()
export class NavDailyScheduler extends BaseScheduler {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundNavUpdateUseCase) private readonly _navUpdateUseCase: IMutualFundNavUpdatesUseCase
    ) {
        super("NAV-DAILY", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        logger.info("[NAV-DAILY] sync started");
        await this._navUpdateUseCase.execute(NavInterval.DAILY);
        logger.info("[NAV-DAILY] sync completed");
    }
}