import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface ISyncFundNavUseCase {
    execute(schemeCode: string, interval: NavInterval): Promise<void>;
}
