import { FundDetailsDTO } from "@application/dto/mutual-funds/fund-details.dto";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface IMutualFundDetailsUseCase {
    execute(schemeCode: string, interval: NavInterval): Promise<FundDetailsDTO>;
}