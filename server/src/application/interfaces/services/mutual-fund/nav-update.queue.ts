import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

export interface INavUpdateQueue {

    addNavUpdateJob(
        schemeCode: string,
        interval: NavInterval
    ): Promise<void>;

    addBulkNavUpdateJobs(
        funds: {
            schemeCode: string;
            interval: NavInterval;
        }[]
    ): Promise<void>;
}