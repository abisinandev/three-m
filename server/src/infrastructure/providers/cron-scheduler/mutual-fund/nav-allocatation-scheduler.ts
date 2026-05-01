import { NavAllocateUseCase } from '@application/use_cases/mutual-fund/nav-allocatation-usecase';
import { BaseScheduler } from '../base.scheduler';
import { injectable, inject } from 'inversify';

@injectable()
export class NavAllocationScheduler extends BaseScheduler {
    constructor(
        @inject(NavAllocateUseCase) private readonly _navAllocateUseCase: NavAllocateUseCase
    ) {
        super("NAV-ALLOCATION", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        console.log("[NAV-ALLOCATION] started");
        await this._navAllocateUseCase.execute();
        console.log("[NAV-ALLOCATION] completed");
    }
}