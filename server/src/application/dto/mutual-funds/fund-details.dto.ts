import { FundCategory } from "@domain/enum/funds/fund-category.enum";
import { CagrDTO } from "./mf-cagr.dto";
import { SubCategory } from "@domain/enum/funds/fund-sub-category.enum";
import { FundStatus } from "@domain/enum/funds/fund-status.enum";
import { RiskLevel } from "@domain/enum/funds/fund-risk-level.enum";
import { NavHistoryDTO } from "./nav-histroy.dto";


export interface FundDetailsDTO {
    id: string;

    schemeCode: string;
    schemeName: string;
    amc: string;

    category: FundCategory;
    subCategory: SubCategory;

    nav: number;
    navDate: Date;

    cagr: CagrDTO | null;

    risk: RiskLevel;
    status: FundStatus;

    logo: string;

    createdAt: Date;
    updatedAt: Date;

    navHistory: NavHistoryDTO[];
}
