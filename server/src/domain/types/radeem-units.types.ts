import { InvestmentStatus } from "@domain/enum/funds/investment.enums";

export type InvestmentRedeemResult = {
    remainingUnits: number;
    redeemedUnits: number;
    status?: InvestmentStatus;
    redeemedAt?: Date;
    updatedAt: Date;
};
