import adminApi from "@/lib/axios-admin";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { MutualFundType, PaginatedMutualFundsResponse } from "@shared/types/mutual-funds/MutualFundType";
import type { AddFundPayload, FetchMutualFundsFilters } from "@shared/types/admin/mutual-fund-management.types";


export const addFundApi = async (
    payload: AddFundPayload
): Promise<unknown> => {
    const response = await adminApi.post(
        API_ROUTES.ADMIN.MUTUAL_FUNDS.ADD,
        payload
    );

    return response.data;
};


export const fetchMutualFunds = async ({
    page,
    search,
    sort,
}: FetchMutualFundsFilters): Promise<PaginatedMutualFundsResponse> => {
    const res = await adminApi.get(API_ROUTES.ADMIN.MUTUAL_FUNDS.LIST, {
        params: {
            page,
            limit: 10,
            search: search || undefined,
            sort,
        },
    });

    return res.data.data;
};



export const updateStatus = async (fund: MutualFundType, newStatus: string) => {
    await adminApi.patch(API_ROUTES.ADMIN.MUTUAL_FUNDS.UPDATE_STATUS(fund.schemeCode), {
        status: newStatus,
    });
}