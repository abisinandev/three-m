import { BaseScheduler } from '../base.scheduler';
import { injectable, inject } from 'inversify';
import { INavAllocateUseCase } from '@application/use_cases/mutual-fund/interfaces/nav-allocate-usecase.interface';
import { MUTUAL_FUND_TYPES } from '@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types';

@injectable()
export class NavAllocationScheduler extends BaseScheduler {
    constructor(
        @inject(MUTUAL_FUND_TYPES.NavAllocateUseCase) private readonly _navAllocateUseCase: INavAllocateUseCase
    ) {
        super("NAV-ALLOCATION", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        console.log("[NAV-ALLOCATION] started");
        await this._navAllocateUseCase.execute();
        console.log("[NAV-ALLOCATION] completed");
    }
}