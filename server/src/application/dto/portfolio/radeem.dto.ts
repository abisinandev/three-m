import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";

export interface RadeemDTO {
    //mutual-fund-details
    mfId: string;
    schemeCode: string;
    schemeName: string;
    amc: string;
    category: FundCategory;
    risk: RiskLevel;
    logo: string;
    status: FundStatus;

    //investment-details
    nav: number;
    navDate: string;
    createdAt: Date;
    updatedAt: Date;
    profit: number,
    totalInvestment: number;
    totalUnits: number;
    currentValue: number;
    roi:number
}