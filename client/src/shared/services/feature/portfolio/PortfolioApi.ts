import api from "@lib/axiosUser";
import type { IInvestmentBaseResponse, IPortfolioDatasResponse, IPortfolioProjectionResponse, IRedeemedInvestment } from "@shared/types/portfolio.types";

export const getPortfolioInvestments = async (
    page = 1,
    limit = 10,
    status?: string | null,
    search?: string
): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get('/user/portfolio', {
        params: { page, limit, status: status || undefined, search: search || undefined },
    });

    const responseData = data?.data;

    return {
        data: responseData?.data ?? [],
        limit: responseData?.limit ?? limit,
        page: responseData?.page ?? page,
        totalCount: responseData?.totalCount ?? 0,
    };
};

export const getPortfolioDatas = async (): Promise<IPortfolioDatasResponse> => {
    const { data } = await api.get('/user/portfolio/datas');

    const responseData = data?.data;

    return {
        totalCount: responseData?.totalCount ?? 0,
        totalInvestment: responseData?.totalInvestment ?? 0,
        totalProfit: responseData?.totalProfit ?? 0,
        currentValue: responseData?.currentValue ?? 0,
        profitPercentage: responseData?.profitPercentage ?? 0,
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
    const { data } = await api.patch('/user/portfolio/confirm-redeem', payload);
    return data;
};

export const getPortfolioProjection = async (): Promise<IPortfolioProjectionResponse> => {
    const { data } = await api.get('/user/portfolio/projection');
    return data?.data;
};
