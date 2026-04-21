import api from "@lib/axiosUser";
import { API_ROUTES } from "@shared/constants/apiRoutes";
import type { IInvestmentBaseResponse, IPortfolioProjectionResponse, IPortfolioSummaryResponse, IRedeemedInvestment } from "@shared/types/portfolio.types";

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
        limit: Number(responseData?.limit ?? limit),
        page: Number(responseData?.page ?? page),
        total: Number(responseData?.total ?? 0),
        totalPages: Number(responseData?.totalPages ?? 0),
    };
};

export const getPortfolioSummary = async (): Promise<IPortfolioSummaryResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.GET_SUMMARY);

    const responseData = data?.data;

    return {
        totalCount: responseData?.totalCount ?? 0,
        totalInvestment: responseData?.totalInvestment ?? 0,
        totalProfit: responseData?.totalProfit ?? 0,
        profitAfterSell: responseData?.profitAfterSell ?? 0,
        totalReturns: responseData?.totalReturns ?? 0,
        currentValue: responseData?.currentValue ?? 0,
        profitPercentage: responseData?.profitPercentage ?? 0,
        xirr: responseData?.xirr ?? null,
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

export const getTradeHistory = async (page = 1, limit = 10): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.TRADE_HISTORY, {
        params: { page, limit }
    });
    const responseData = data?.data;
    return {
        data: responseData?.data ?? [],
        limit: Number(responseData?.limit ?? limit),
        page: Number(responseData?.page ?? page),
        total: Number(responseData?.total ?? 0),
        totalPages: Number(responseData?.totalPages ?? 0),
    };
};

export const getPortfolioAssets = async (
    page = 1,
    limit = 10,
    search?: string,
    assetType: "MF" | "STOCK" | "ALL" = "ALL"
): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.GET_ASSETS, {
        params: { page, limit, search, assetType }
    });

    const responseData = data?.data;

    return {
        data: responseData?.data.map((item: any) => ({
            ...item,
            // Mapping for existing UI compatibility
            schemeCode: item.symbol || item.assetId,
            schemeName: item.name || item.symbol || item.assetId,
            logo: item.logo || "",
            amount: item.investedAmount,
            units: item.quantity,
            nav: item.avgPrice,
            navDate: item.updatedAt || item.createdAt,
            investmentType: item.assetType === "MF" ? "MUTUAL_FUND" : "STOCK",
            paymentMethod: "WALLET", // Default as per existing logic
        })) ?? [],
        limit: Number(responseData?.limit ?? limit),
        page: Number(responseData?.page ?? page),
        total: Number(responseData?.total ?? 0),
        totalPages: Number(responseData?.totalPages ?? 0),
    };
};

export const getMFHoldings = (page = 1, limit = 10, search?: string) => 
    getPortfolioAssets(page, limit, search, "MF");

export const getStockHoldings = (page = 1, limit = 10, search?: string) => 
    getPortfolioAssets(page, limit, search, "STOCK");

export const getHistories = async (page = 1, limit = 10): Promise<IInvestmentBaseResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.HISTORIES, {
        params: { page, limit }
    });
    const responseData = data?.data;
    return {
        data: responseData?.data ?? [],
        limit: Number(responseData?.limit ?? limit),
        page: Number(responseData?.page ?? page),
        total: Number(responseData?.total ?? 0),
        totalPages: Number(responseData?.totalPages ?? 0),
    };
};
