export interface SipInstallment {
    id?: string;
    sipId: string;
    userId: string;
    schemeCode: string;
    installmentNo: number;
    executionDate: string; // Backend sends Date, frontend receives string
    amount: number;
    nav?: number;
    units?: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    failureReason?: string;
    investmentId?: string;
    createdAt: string;
}

export interface SipResponse {
    id: string;
    userId: string;
    userCode?: string;
    schemeCode: string;
    schemeName?: string;
    logo?: string;

    amount: number;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    startDate: string;
    nextExecutionDate: string;
    totalInstallments: number;
    executedInstallments: number;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    createdAt: string;
    updatedAt?: string;
    installments?: SipInstallment[];
}
