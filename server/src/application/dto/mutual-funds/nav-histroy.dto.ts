import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface NavHistoryDTO {
    schemeCode?: string;
    nav: number;
    navDate: Date;
    interval: NavInterval;
    source?: string;
}