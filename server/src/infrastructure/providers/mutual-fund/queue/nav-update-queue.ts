import { INavUpdateQueue } from "@application/interfaces/services/mutual-fund/nav-update.queue";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { bullConnection } from "@infrastructure/providers/bullmq/queue.config";
import { Queue } from "bullmq";
import { injectable } from "inversify";

@injectable()
export class NavUpdateQueue implements INavUpdateQueue {

    private queue: Queue;

    constructor() {
        this.queue = new Queue(
            "update-navs",
            {
                connection: bullConnection,
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 1000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }
        );
    }


    async addNavUpdateJob(schemeCode: string, interval: NavInterval): Promise<void> {

        await this.queue.add(
            "UPDATE_SINGLE_NAV",

            {
                schemeCode,
                interval,
            },

            {
                jobId: `nav-${schemeCode}-${Date.now()}`,
            }
        );
    }

    async addBulkNavUpdateJobs(funds: { schemeCode: string; interval: NavInterval; }[]): Promise<void> {
        const timestamp = Date.now();
        await this.queue.addBulk(

            funds.map((fund) => ({

                name: "UPDATE_SINGLE_NAV",

                data: {
                    schemeCode: fund.schemeCode,
                    interval: fund.interval,
                },

                opts: {
                    jobId: `nav-${fund.schemeCode}-${timestamp}`,
                },
            }))
        )
    }
}