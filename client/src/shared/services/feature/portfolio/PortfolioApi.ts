import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { IInvestmentBaseResponse, IPortfolioDatasResponse, IPortfolioProjectionResponse, IRedeemedInvestment } from "@shared/types/portfolio.types";

export const getPortfolioInvestments = async (
    page = 1,
    limit = 10,
    status?: string | null,
    search?: string
): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.GET_INVESTMENTS, {
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
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.GET_DATAS);

    const responseData = data?.data;

    return {
        totalCount: responseData?.totalCount ?? 0,
        totalInvestment: responseData?.totalInvestment ?? 0,
        totalProfit: responseData?.totalProfit ?? 0,
        realizedProfit: responseData?.realizedProfit ?? 0,
        totalReturns: responseData?.totalReturns ?? 0,
        currentValue: responseData?.currentValue ?? 0,
        profitPercentage: responseData?.profitPercentage ?? 0,
    };
};

export const getRedeemableInvestments = async (): Promise<IRedeemedInvestment[]> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.REDEEM_INVESTMENT);
    return data?.data ?? [];
};

export const confirmRedeemInvestment = async (payload: {
    schemeCode: string;
    amount?: number | string;
    units?: number | string;
}) => {
    const { data } = await api.patch(API_ROUTES.USER.PORTFOLIO.CONFIRM_REDEEM, payload);
    return data;
};

export const getPortfolioProjection = async (): Promise<IPortfolioProjectionResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.PROJECTION);
    return data?.data;
};

export const getTradeHistory = async (page = 1, limit = 10) => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.TRADE_HISTORY, {
        params: { page, limit }
    });
    return data?.data;
};

export const getMFHoldings = async (page = 1, limit = 10, search?: string) => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.INVESTMENTS, {
        params: { page, limit, search }
    });
    return data?.data;
};

export const getStockHoldings = async (page = 1, limit = 10, search?: string) => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.TRADES, {
        params: { page, limit, search }
    });
    return data?.data;
};

export const getHistories = async (page = 1, limit = 10) => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.HISTORIES, {
        params: { page, limit }
    });
    return data?.data;
};
