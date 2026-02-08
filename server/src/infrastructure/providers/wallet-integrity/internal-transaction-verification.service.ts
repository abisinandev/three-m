import { ISystemVerifyTransactionUseCase } from "@application/use_cases/admin/interfaces/system-verify-transaction.interface";
import { inject, injectable } from "inversify";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { IInternalTransactionVerificationService } from "@application/interfaces/services/externals/internal-transaction-verify.interface";
import { logger } from "../logger/pino.logger";

@injectable()
export class InternalTransactionVerificationService implements IInternalTransactionVerificationService {

    constructor(
        @inject(EXTERNAL_TYPES.SystemVerifyTransactionUseCase)
        private readonly verifier: ISystemVerifyTransactionUseCase
    ) { }

    async verify(txId: string): Promise<void> {
        logger.info("Transaction verification processing...")
        await this.verifier.execute(txId);
    }
}
 