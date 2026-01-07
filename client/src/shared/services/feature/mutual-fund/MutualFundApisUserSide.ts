import api from "@lib/axiosUser";
import type { MutualFundType } from "@shared/types/mutual-funds/MutualFundType";

export const fetchMutualFunds = async (
    search: string,
    filters: string[]
): Promise<MutualFundType[]> => {
    const { data } = await api.get('/user/mutual-funds/lists', {
        params: {
            search: search || undefined,
            category: filters.includes('All Funds')
                ? undefined
                : filters.join(','),
        },
    });

    return data.data.data;
};
