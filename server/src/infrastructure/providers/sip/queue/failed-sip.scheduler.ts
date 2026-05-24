import { inject, injectable } from 'inversify';
import { BaseScheduler } from '@infrastructure/providers/cron-scheduler/base.scheduler';
import { SIP_TYPES } from '@infrastructure/inversify_di/features/sip/sip.types';
import { IAnalyzeFailedInstallmentsUseCase } from '@application/use_cases/sip/interfaces/analyze-failed-installments-usecase.interface';

@injectable()
export class FailedSipScheduler extends BaseScheduler {

    constructor(
        @inject(SIP_TYPES.AnalyzeFailedInstallmentsUseCase) private readonly _analyzeFailedSips: IAnalyzeFailedInstallmentsUseCase,
    ) {
        // Run every hour 
        super('FAILED-SIP-SCHEDULER', '0 * * * *');
    }

    protected async execute(): Promise<void> {
        await this._analyzeFailedSips.execute();
    }
}
