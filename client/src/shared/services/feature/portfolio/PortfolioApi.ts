import api from "@lib/axiosUser";
import type { IInvestmentBaseResponse, IRedeemedInvestment } from "@shared/types/portfolio.types";

export const getPortfolioInvestments = async (
    page = 1,
    limit = 10
): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get('/user/portfolio', {
        params: { page, limit },
    });

    const responseData = data?.data;

    return {
        data: responseData?.data ?? [],
        totalCount: responseData?.totalCount ?? 0,
        totalInvestment: responseData?.totalInvestment ?? 0,
        totalProfit: responseData?.totalProfit ?? 0,
        limit: responseData?.limit ?? limit,
        page: responseData?.page ?? page,
    };
};

export const getRedeemableInvestments = async (): Promise<IRedeemedInvestment[]> => {
    const { data } = await api.get('/user/portfolio/redeem-investment');
    return data?.data ?? [];
};

export const confirmRedeemInvestment = async (payload: {
    schemeCode: string;
    amount?: number | string;
    units?: number | string;
}) => {
    const { data } = await api.patch('/user/portfolio/confrim-redeem', payload);
    return data;
};
