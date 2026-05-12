import { inject, injectable } from "inversify";
import { IMutualFundNavUpdatesUseCase } from "./interfaces/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { INavUpdateQueue } from "@application/interfaces/services/mutual-fund/nav-update.queue";

@injectable()
export class MutualFundNavUpdateUsecase implements IMutualFundNavUpdatesUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateQueue) private readonly _navUpdateQueue: INavUpdateQueue,
    ) { }

    async execute(interval: NavInterval): Promise<void> {
        const { funds } = await this._mutualFundRepository.findActiveFunds();

        logger.info(`Dispatching NAV update jobs for ${funds.length} funds to queue`);

        await this._navUpdateQueue.addBulkNavUpdateJobs(
            funds.map(fund => ({
                schemeCode: fund.schemeCode,
                interval
            }))
        );

        logger.info(`All NAV update jobs dispatched successfully`);
    }
}
   
