import type { SipStatus, SIP, SipInstallment } from "@modules/admin/sip/types/SipTypes";

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
