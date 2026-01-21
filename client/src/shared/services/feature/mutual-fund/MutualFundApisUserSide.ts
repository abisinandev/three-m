import api from "@lib/axiosUser";
import type { IFundDetails, PaginatedMutualFundsResponse } from "@shared/types/mutual-funds/MutualFundType";

export const fetchMutualFunds = async (
    search: string,
    filters: string[]
): Promise<PaginatedMutualFundsResponse> => {
    const { data } = await api.get('/user/mutual-funds/lists', {
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
    activePeriod: string
): Promise<IFundDetails> => {
    const res = await api.get(`/user/mutual-funds/${schemeCode}`, {
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
    return await api.post('/user/mutual-funds/investment/one-time', payload);
}

export const startSip = async (payload: {
    schemeCode: string;
    amount: number;
    frequency: string;
    startDate: string;
    totalInstallments: number;
    paymentMethod: string;
}) => {
    return await api.post('/user/mutual-funds/sip/create', payload);
}
