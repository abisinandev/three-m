import { MfCagrUseCase } from '@application/use_cases/mutual-fund/mf-cagr-usecase';
import { BaseScheduler } from '../base.scheduler';
import { injectable, inject } from 'inversify';

@injectable()
export class CagrUpdateScheduler extends BaseScheduler {
    constructor(
        @inject(MfCagrUseCase) private readonly _cagrUseCase: MfCagrUseCase
    ) {
        super("CAGR-UPDATE", "0 2,3,9 * * *");
    }

    protected async execute(): Promise<void> {
        console.log("[CAGR-UPDATE] started");
        await this._cagrUseCase.execute();
        console.log("[CAGR-UPDATE] completed");
    }
}