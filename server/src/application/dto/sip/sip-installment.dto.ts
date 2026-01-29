import { SipInstallmentStatus } from "@domain/enum/funds/sip-intallment-status";

export interface SipInstallmentDto {
    id?: string;

    sipId: string;
    userId: string;
    schemeCode: string;

    installmentNo: number;
    executionDate: Date;

    amount: number;

    nav?: number;
    units?: number;

    status: SipInstallmentStatus;
    failureReason?: string;

    investmentId?: string;

    createdAt: Date;
}
