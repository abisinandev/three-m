import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface MutualFundNavDTO{
    id?: string;
    schemeCode: string;
    nav: number;
    navDate: Date;
    source: string;
    interval: NavInterval;
    createdAt?: Date;
    updatedAt?: Date;
}