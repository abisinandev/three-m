import { ISystemVerifyTransactionUseCase } from "@application/use_cases/interfaces/admin/system-verify-transaction.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { inject, injectable } from "inversify";

@injectable()
export class InternalTransactionVerificationService {

    constructor(
        @inject(FEATURE_TYPES.SystemVerifyTransactionUseCase)
        private readonly verifier: ISystemVerifyTransactionUseCase
    ) { }

    async verify(txId: string): Promise<void> {
        console.log("TranscztionId: ", txId);
        await this.verifier.execute(txId);
    }
}
