import { ISystemVerifyTransactionUseCase } from "@application/use_cases/admin/interfaces/system-verify-transaction.interface";
import { inject, injectable } from "inversify";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";

@injectable()
export class InternalTransactionVerificationService {

    constructor(
        @inject(EXTERNAL_TYPES.SystemVerifyTransactionUseCase)
        private readonly verifier: ISystemVerifyTransactionUseCase
    ) { }

    async verify(txId: string): Promise<void> {
        console.log("TranscztionId: ", txId);
        await this.verifier.execute(txId);
    }
}
