import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";

export interface IExecuteDueSipsUseCase {
    execute(): Promise<void>;
}