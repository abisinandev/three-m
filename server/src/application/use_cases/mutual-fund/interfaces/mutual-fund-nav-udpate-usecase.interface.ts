import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface IMutualFundNavUpdatesUseCase {
    execute(interval: NavInterval): Promise<void>;
}