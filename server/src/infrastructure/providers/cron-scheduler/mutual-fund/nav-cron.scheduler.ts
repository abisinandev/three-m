import { MutualFundNavUpdate } from '@application/use_cases/mutual-fund/mutual-fund-nav-update.usecase';
import { NavInterval } from '@domain/enum/funds/nav-intervals.enums';
import { BaseScheduler } from '../base.scheduler';
import { injectable, inject } from 'inversify';

@injectable()
export class NavDailyScheduler extends BaseScheduler {
    constructor(
        @inject(MutualFundNavUpdate) private readonly _navUpdateUseCase: MutualFundNavUpdate
    ) {
        super("NAV-DAILY", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        console.log("[NAV-DAILY] sync started");
        await this._navUpdateUseCase.execute(NavInterval.DAILY);
        console.log("[NAV-DAILY] sync completed");
    }
}