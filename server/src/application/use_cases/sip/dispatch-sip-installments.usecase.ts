import { inject, injectable } from "inversify";
import { SIP_TYPES } from "@infrastructure/inversify_di/features/sip/sip.types";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { ISipQueue } from "@application/interfaces/services/sip/sip-queue.interface";
import { IDispatchSipInstallmentsUseCase } from "./interfaces/dispatch-sip-installments-usecase.interface";

@injectable()
export class DispatchSipInstallmentsUseCase implements IDispatchSipInstallmentsUseCase {
    constructor(
        @inject(SIP_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(SIP_TYPES.SipQueue) private readonly _sipQueue: ISipQueue,
    ) { }

    async execute(): Promise<void> {
        const dueInstallments = await this._sipInstallmentRepository.findActiveDueSips() ?? [];

        for (let installment of dueInstallments) {
            await this._sipQueue.addSipExecutionJob(installment.id as string);
        }
    }
}
