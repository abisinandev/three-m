import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface ISyncSingleFundNavUseCase {
    execute(schemeCode: string, interval: NavInterval): Promise<void>;
}
