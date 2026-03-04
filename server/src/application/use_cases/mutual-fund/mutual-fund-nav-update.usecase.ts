import { inject, injectable } from "inversify";
import { IMutualFundNavUpdatesUseCase } from "./interfaces/mutual-fund-nav-udpate-usecase.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavHistoryDTO } from "@application/dto/mutual-funds/nav-histroy.dto";

@injectable()
export class MutualFundNavUpdate implements IMutualFundNavUpdatesUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly _mutualFundNavRepository: IMutualFundNavRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(interval: NavInterval): Promise<void> {
        const { funds } = await this._mutualFundRepository.findActiveFunds();

        for (const fund of funds) {
            try {
                const latestNav = await this._mutualFundNavRepository.getLatestNav(fund.schemeCode);

                const navs = await this._navUpdateProvider.fetchNavSince(fund.schemeCode, latestNav?.navDate as Date) ?? []
                if (!navs.length) continue;

                const navEntities: NavHistoryDTO[] = navs.map(data => ({
                    schemeCode: data.schemeCode,
                    nav: data.nav,
                    navDate: new Date(data.navDate),
                    interval,
                    source: "MF_API",
                }));
                await this._mutualFundNavRepository.bulkUpsertNavs(navEntities);
                logger.info("Nav updation done");

            } catch (error) {
                logger.info("Nav updation failed");
                return
            }
        }
    }
}   
