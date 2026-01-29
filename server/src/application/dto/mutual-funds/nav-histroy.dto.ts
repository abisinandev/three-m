import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface NavHistoryDTO {
    nav: number;
    navDate: Date;
    interval: NavInterval;
}