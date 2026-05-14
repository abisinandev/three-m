import { inject, injectable } from "inversify";
import { IMutualFundNavService } from "./interfaces/mutual-fund-nav.service.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { EXTERNAL_TYPES } from "@infrastructure/inversify_di/features/external/external.types";
import { ICacheProvider } from "@application/interfaces/services/externals/redis-cache.provider.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { logger } from "@infrastructure/providers/logger/pino.logger";
import AppError from "@presentation/express/utils/error-handling/app.error";

@injectable()
export class MutualFundNavService implements IMutualFundNavService {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundNavRepository) private readonly _navRepository: IMutualFundNavRepository,
        @inject(EXTERNAL_TYPES.RedisCacheProvider) private readonly _cache: ICacheProvider,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async getLatestNav(schemeCode: string): Promise<{ nav: number; navDate: Date }> {
        const cacheKey = `mf-nav:${schemeCode}`;

        try {
            const cachedNav = await this._cache.get(cacheKey);
            if (cachedNav) {
                return {
                    nav: Number(cachedNav),
                    navDate: new Date()
                };
            }
            const persistentNav = await this._navRepository.getLatestNav(schemeCode);
            if (persistentNav) {
                const nav = Number(persistentNav.nav);
                await this._cache.set(cacheKey, nav.toString(), 3600);
                return { nav, navDate: persistentNav.navDate };
            }

            logger.warn({ schemeCode }, "[MutualFundNavService] Cache and DB miss. Fetching from API.");
            const apiNavs = await this._navUpdateProvider.fetchNavHistories(schemeCode);

            if (apiNavs && apiNavs.length > 0) {
                const latest = apiNavs[0];
                const nav = Number(latest.nav);
                const navDate = new Date(latest.navDate);

                await this._cache.set(cacheKey, nav.toString(), 3600);

                return { nav, navDate };
            }

            throw new AppError(`NAV not found for scheme: ${schemeCode}`);

        } catch (error) {
            logger.error({ error, schemeCode }, "[MutualFundNavService] Failed to retrieve NAV");
            throw error;
        }
    }
}
