import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";

export interface InvestmentFundDTO {
    id: string;
    userId: string;
    schemeCode: string;
    amount: number;
    units: number;
    nav: number;
    navDate: Date;
    status: InvestmentStatus;
    investmentType: InvestmentType;
    paymentMethod: PaymentMethod;
    remainingUnits: number;
    redeemedUnits: number;
    redeemedAmount: number;
    redeemedAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
    fund?: {
        schemeName: string;
        category: string;
        risk: string;
        amc: string;
        logo: string;
    };
}

export interface PortfolioStockDTO {
    id: string;
    userId: string;
    assetId: string;
    assetType: string;
    quantity: number;
    avgPrice: number;
    investedAmount: number;
    currentPrice?: number;
    createdAt: Date;
    updatedAt: Date;
    stockDetails?: {
        name: string;
        symbol: string;
        exchange: string;
        logo: string;
    };
}
