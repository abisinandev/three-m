import { InvestmentStatus, InvestmentType, PaymentMethod } from "@domain/enum/funds/investment.enums";

export interface InvestmentResponseDTO {
    id?: string;
    userId: string;
    schemeCode: string;

    amount: number;
    quantity?: number;
    avgPrice?: number;
    currentPrice?: number;
    units?: number;
    currentValue?: number;
    profitPercentage?: number;

    nav?: number;
    navDate?: Date;
    schemeName: string;
    category: string;
    status: InvestmentStatus;
    paymentMethod: PaymentMethod;
    investmentType: InvestmentType;
    logo: string;
    remainingUnits?: number;
    redeemedUnits?: number;
    redeemedAmount?: number;
    redeemedAt?: Date;
    profit: number;
    xirr?: number;
    stopLoss?: number | null;
    takeProfit?: number | null;
    createdAt: Date;
    updatedAt?: Date;
}
