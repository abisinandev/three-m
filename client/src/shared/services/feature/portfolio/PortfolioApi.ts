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

export const getPortfolioProjection = async (
    expectedReturnRate = 12,
    years = 10
): Promise<IPortfolioProjectionResponse> => {
    const { data } = await api.get(API_ROUTES.USER.PORTFOLIO.PROJECTION, {
        params: { expectedReturnRate, years },
    });
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
    let url = API_ROUTES.USER.PORTFOLIO.GET_ASSETS;
    if (assetType === "MF") url = API_ROUTES.USER.PORTFOLIO.GET_MF_ASSETS;
    if (assetType === "STOCK") url = API_ROUTES.USER.PORTFOLIO.GET_STOCK_ASSETS;

    const { data } = await api.get(url, {
        params: { page, limit, search }
    });

    const responseData = data?.data;

    return {
        data: responseData?.data.map((item: any) => {
            const isStock = item.assetType === "STOCK" || item.investmentType === "STOCK";
            return {
                ...item,
                // Unified field mapping for UI compatibility
                assetType: item.assetType || (isStock ? "STOCK" : "MF"),
                schemeCode: item.symbol || item.schemeCode || item.assetId,
                schemeName: item.name || item.schemeName || item.symbol || item.assetId,
                logo: item.logo || "",
                amount: item.investedAmount || item.amount,
                // For stocks: quantity is shares; for MF: units are fund units
                units: item.quantity ?? item.units,
                // nav = LTP (Last Traded Price) for stocks; NAV for MF
                nav: isStock ? (item.currentPrice || item.avgPrice || item.nav) : (item.nav || item.avgPrice),
                navDate: item.navDate || item.updatedAt || item.createdAt,
                investmentType: item.investmentType || (isStock ? "STOCK" : "MUTUAL_FUND"),
                paymentMethod: item.paymentMethod || "WALLET",
                currentPrice: item.currentPrice || item.avgPrice,
                currentValue: item.currentValue,
                profitPercentage: item.profitPercentage,
                profit: item.profit || 0,
            };
        }) ?? [],
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
