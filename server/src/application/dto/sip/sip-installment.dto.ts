import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";

export interface SipInstallmentDto {

    schemeCode: string;

    installmentNo: number;
    executionDate: Date;

    amount: number;

    nav?: number;
    units?: number;

    status: SipInstallmentStatus;
    failureReason?: string;

    investmentId?: string;
    retryCount: number;

    createdAt: Date;
}
