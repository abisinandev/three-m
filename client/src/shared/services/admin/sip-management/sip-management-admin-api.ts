import adminApi from "@/lib/axios-admin";
import type { SIP } from "@/modules/admin/sip/types/SipTypes";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type {
    SipFilters,
    SipListResponse,
} from "@shared/types/admin/sip-management.types";




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



