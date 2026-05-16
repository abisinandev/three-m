import { inject, injectable } from 'inversify';
import { BaseScheduler } from '@infrastructure/providers/cron-scheduler/base.scheduler';
import { SIP_TYPES } from '@infrastructure/inversify_di/features/sip/sip.types';
import { IDispatchSipInstallmentsUseCase } from '@application/use_cases/sip/interfaces/dispatch-sip-installments-usecase.interface';

@injectable()
export class SipScheduler extends BaseScheduler {

    constructor(
        @inject(SIP_TYPES.DispatchSipInstallmentsUseCase) private readonly _dispatchDueSips: IDispatchSipInstallmentsUseCase,
    ) {
        // Run every day at 6:00 AM and 9:00 AM IST
        super('SIP-SCHEDULER', '0 6,9 * * *');
    }

    protected async execute(): Promise<void> {
        await this._dispatchDueSips.execute();
    }
}
