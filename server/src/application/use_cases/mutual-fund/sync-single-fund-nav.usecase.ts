import { inject, injectable } from "inversify";
import { ISyncSingleFundNavUseCase } from "./interfaces/sync-single-fund-nav.usecase.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import { NavHistoryDTO } from "@application/dto/mutual-funds/nav-histroy.dto";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";

@injectable()
export class SyncSingleFundNavUseCase implements ISyncSingleFundNavUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly _mutualFundNavRepository: IMutualFundNavRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cache: ICacheProvider,
    ) { }

    async execute(schemeCode: string, interval: NavInterval): Promise<void> {
        const latestNav = await this._mutualFundNavRepository.getLatestNav(schemeCode);

        const navs = await this._navUpdateProvider.fetchNavSince(
            schemeCode,
            latestNav?.navDate as Date
        ) ?? [];

        if (!navs.length) return;

        const navEntities: NavHistoryDTO[] =
            navs.map(data => ({
                schemeCode: data.schemeCode,
                nav: data.nav,
                navDate: new Date(data.navDate),
                interval,
                source: "MF_API",
            }));

        await this._mutualFundNavRepository.bulkUpsertNavs(navEntities);

        const latest = navEntities[0];

        await this._cache.set(
            `mf-nav:${schemeCode}`,
            latest.nav.toString(),
            3600
        );

        logger.info({
            schemeCode,
            latestNav: latest.nav,
            count: navEntities.length,
        }, "NAV updated");
    }
}
 