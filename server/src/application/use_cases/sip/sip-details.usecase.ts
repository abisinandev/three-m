import { inject, injectable } from "inversify";
import { ISipDetailsUseCase } from "../interfaces/features/sip/sip-details-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { ISipInstallmentRepository } from "@application/interfaces/repositories/feature/sip-intallment-repository.interface";
import { ISipRepository } from "@application/interfaces/repositories/feature/sip-repository.interface";
import { SipInstallmentDto } from "@application/dto/sip/sip-installment.dto";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";

@injectable()
export class SipDetailsUseCase implements ISipDetailsUseCase {

    constructor(
        @inject(FEATURE_TYPES.SipInstallmentRepository) private readonly _sipInstallmentRepository: ISipInstallmentRepository,
        @inject(FEATURE_TYPES.SipRepository) private readonly _sipRepository: ISipRepository,
    ) { }

    async execute(sipId: string, userId: string): Promise<SipInstallmentDto[]> {
        
        const sip = await this._sipRepository.findById(sipId);
        if (!sip) {
            throw new NotFoundError('SIP not found');
        }
        
        const actualUserId = sip.userId;
        
        const installments = await this._sipInstallmentRepository.findInstallmentsByUser(actualUserId);
        console.log("Installment: ",installments)
        if (!installments || installments.length === 0) {
            return [];
        }

        return installments.map(installment => ({
            id: installment.id,
            sipId: installment.sipId,
            userId: installment.userId,
            schemeCode: installment.schemeCode,
            installmentNo: installment.installmentNo,
            executionDate: installment.executionDate,
            amount: installment.amount,
            nav: installment.nav ?? undefined,
            units: installment.units ?? undefined,
            status: installment.status,
            failureReason: installment.failureReason ?? undefined,
            investmentId: installment.investmentId ?? undefined,
            createdAt: installment.createdAt,
        }));
    }
}  