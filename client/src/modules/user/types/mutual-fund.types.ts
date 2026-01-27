export interface SipInstallmentDto {
    id?: string;
    sipId: string;
    userId: string;
    schemeCode: string;
    installmentNo: number;
    executionDate: string; // Backend sends Date, frontend receives string
    amount: number;
    nav?: number;
    units?: number;
    status: 'pending' | 'success' | 'failed';
    failureReason?: string;
    investmentId?: string;
    createdAt: string;
}

export interface SipDto {
    id: string;
    userId: string;
    userCode?: string;
    schemeCode: string;
    amount: number;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    startDate: string;
    nextExecutionDate: string;
    totalInstallments: number;
    executedInstallments: number;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    createdAt: string;
    updatedAt?: string;
    installments?: SipInstallmentDto[];
}
