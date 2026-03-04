import adminApi from "@lib/axiosAdmin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { SipStatus, SIP, SipInstallment } from "@modules/admin/types/SipTypes";


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



export const fetchSipsApi = async (
    filters?: SipFilters
): Promise<SipListResponse> => {
    const { data } = await adminApi.get<{ data: SipListResponse }>(
        API_ROUTES.ADMIN.SIP.GET_ALL,
        {
            params: filters,
        }
    );

    return data.data;
};

export interface SipDetailsApiResponse {
    data: SIP;
    page: number;
    limit: number;
    totalCount: number;
}

export const fetchSipDetailsApi = async (
    sipId: string,
    params?: {
        page?: number;
        limit?: number;
        status?: string;
    }
): Promise<SipDetailsApiResponse> => {
    const { data } = await adminApi.get(
        API_ROUTES.ADMIN.SIP.DETAILS(sipId),
        { params }
    );

    return data.data;
};



