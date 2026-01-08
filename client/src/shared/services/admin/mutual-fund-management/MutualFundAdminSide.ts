import adminApi from "@lib/axiosAdmin";
import type { MutualFundType, PaginatedMutualFundsResponse } from "@shared/types/mutual-funds/MutualFundType";

export type AddFundPayload = {
    schemeCode: string;
    schemeName: string;
    amc: string;
    category: string;
    subCategory: string;
    risk: string;
    logo?: string;
};

export const addFundApi = async (
    payload: AddFundPayload
): Promise<any> => {
    const response = await adminApi.post(
        "/mutual-funds/add-fund",
        payload
    );

    return response.data;
};




export const fetchMutualFunds = async ({
    page,
    search,
    sort,
}: {
    page: number;
    search: string;
    sort: string;
}): Promise<PaginatedMutualFundsResponse> => {
    const res = await adminApi.get('/mutual-funds/list', {
        params: {
            page,
            limit: 10,
            search: search || undefined,
            sort,
        },
    });

    return res.data.data;
};



export const updateStatus = async (fund: MutualFundType, newStatus:string) => {
    await adminApi.patch(`/mutual-funds/${fund.id}/status`, {
        status: newStatus ,
    });
}