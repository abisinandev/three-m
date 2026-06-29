export type SipStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';
export type InstallmentStatus = 'PENDING' | 'PAYMENT_SUCCESS' | 'ALLOCATED' | 'FAILED';

export interface SIP {
    id: string;
    userCode?: string;
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
    installments: SipInstallment[],
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

export type SipFilters = {
    page?: number;
    limit?: number;
    search?: string;
    status?: SipStatus | "ALL";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export interface SipListResponse {
    data: SIP[];
    totalCount: number;
    totalActiveSips: number;
    page: number;
    limit: number;
}

export interface SipInstallmentsResponse {
    data: SipInstallment[];
    page: number;
    limit: number;
    totalCount: number;
    totalActiveSips: number;
}

export interface SipDetailsApiResponse {
    data: SIP;
    page: number;
    limit: number;
    totalCount: number;
}
