import { SipInstallmentDto } from "@application/dto/sip/sip-installment.dto";
import { SipInstallmentEntity } from "@domain/entities/mutual-fund/sip-intallment.entity";

export const toSipInstallmentResponse = (e: SipInstallmentEntity): SipInstallmentDto => ({
    id: e.id,
    sipId: e.sipId,
    userId: e.userId,
    schemeCode: e.schemeCode,
    installmentNo: e.installmentNo,
    executionDate: e.executionDate,
    amount: e.amount,
    nav: e.nav,
    units: e.units,
    status: e.status,
    failureReason: e.failureReason,
    investmentId: e.investmentId,
    createdAt: e.createdAt,
});
