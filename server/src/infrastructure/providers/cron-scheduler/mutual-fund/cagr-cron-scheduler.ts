import { injectable, inject } from 'inversify';
import { IMfCagrUseCase } from '@application/use_cases/mutual-fund/interfaces/mf-cagr-usecse.interface';
import { MUTUAL_FUND_TYPES } from '@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types';
import { BaseScheduler } from '../base.scheduler';

@injectable()
export class CagrUpdateScheduler extends BaseScheduler {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MfCagrUseCase) private readonly _cagrUseCase: IMfCagrUseCase
    ) {
        super("CAGR-UPDATE", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        console.log("[CAGR-UPDATE] started");
        await this._cagrUseCase.execute();
        console.log("[CAGR-UPDATE] completed");
    }
}