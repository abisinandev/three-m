import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { Document, } from "mongoose";


export interface MutualFundDocument extends Document {
    id: string;
    schemeCode: string;
    schemeName: string;
    source: string;
    amc: string;

    category: FundCategory;
    subCategory: SubCategory;
    risk: RiskLevel;
    status: FundStatus;
    logo: string;
    createdAt: Date;
    updatedAt: Date;
}
