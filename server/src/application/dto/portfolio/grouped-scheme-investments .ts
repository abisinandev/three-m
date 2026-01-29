import { InvestmentEntity } from "@domain/entities/mutual-fund/investment.entity";

export interface GroupedSchemeInvestments {
    schemeCode: string;
    totalUnits: number;
    totalInvestment: number;
    investments: InvestmentEntity[];
}
