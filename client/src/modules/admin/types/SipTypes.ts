export type SipStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';
export type InstallmentStatus = 'PENDING' | 'PAYMENT_SUCCESS' | 'ALLOCATED' | 'FAILED';

export interface SIP {
    id: string;
    userId: string;
    schemeCode: string;
    amount: number;
    frequency: 'Monthly' | 'Weekly';
    startDate: string;
    nextExecutionDate: string;
    totalInstallments: number;
    executedInstallments: number;
    status: SipStatus;
    createdAt: string;
    updatedAt: string;
}

export interface SipInstallment {
    id: string;
    installmentNo: number;
    executionDate: string;
    amount: number;
    status: InstallmentStatus;
    nav: number | null;
    units: number | null;
    navDate: string | null;
    investmentId: string | null;
    failureReason: string | null;
    createdAt: string;
}

export interface NavMonitoring {
    schemeCode: string;
    navDate: string;
    navValue: number;
    fetchStatus: string;
    lastUpdatedTime: string;
}
