import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { IFundDetails, PaginatedMutualFundsResponse } from "@shared/types/mutual-funds/MutualFundType";

export const fetchMutualFunds = async (
    search: string,
    filters: string[]
): Promise<PaginatedMutualFundsResponse> => {
    const { data } = await api.get(API_ROUTES.USER.MUTUAL_FUNDS.LIST, {
        params: {
            search: search || undefined,
            category: filters.includes('All Funds')
                ? undefined
                : filters.join(','),
        },
    });

    return data.data;
};

export const getMutualFundDetails = async (
    schemeCode: string,
    activePeriod: string,
): Promise<IFundDetails> => {
    const res = await api.get(API_ROUTES.USER.MUTUAL_FUNDS.DETAILS(schemeCode), {
        params: { interval: activePeriod },
    });
    return res.data.data;
}

export const investOneTime = async (payload: {
    schemeCode: string;
    amount: number;
    units: number;
    paymentMethod: string;
    investmentType: string;
}) => {
    return await api.post(API_ROUTES.USER.MUTUAL_FUNDS.INVEST_ONE_TIME, payload);
}

export const startSip = async (payload: {
    schemeCode: string;
    amount: number;
    frequency: string;
    startDate: string;
    totalInstallments: number;
    paymentMethod: string;
}) => {
    return await api.post(API_ROUTES.USER.MUTUAL_FUNDS.START_SIP, payload);
}


export const fetchSips = async () => {
    const response = await api.get(API_ROUTES.USER.MUTUAL_FUNDS.FETCH_SIPS);
    return response.data
}