import adminApi from "@lib/axiosAdmin";
import type { SipStatus } from "@modules/admin/types/SipTypes";

export type SipFilters = {
    page?: number;
    limit?: number;
    search?: string;
    status?: SipStatus | 'ALL';
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export const FetchSipsApi = async (filters: SipFilters) => {
    const response = await adminApi.get("/sip-management", {
        params: filters,
    });
    return response.data;
};

export const UpdateSipStatusApi = async ({ sipId, status }: { sipId: string; status: SipStatus }) => {
    const response = await adminApi.patch(`/sip-management/${sipId}/status`, {
        status,
    });
    return response.data;
};

export const FetchSipDetailsApi = async (sipId: string) => {
    const response = await adminApi.get(`/sip-management/${sipId}`);
    return response.data;
};
