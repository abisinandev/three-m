import { inject, injectable } from "inversify";
import { IMutualFundNavUpdatesUseCase } from "./interfaces/mutual-fund-nav-udpate-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { toEntity } from "@application/mappers/mutual-fund/mf-nav.mapper";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";

@injectable()
export class MutualFundNavUpdate implements IMutualFundNavUpdatesUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(FEATURE_TYPES.MutualFundNavRepository) private readonly _mutualFundNavRepository: IMutualFundNavRepository,
        @inject(FEATURE_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(interval: NavInterval): Promise<void> {
        const { funds } = await this._mutualFundRepository.findActiveFunds();
        console.log("INterval: ",interval)
        for (const fund of funds) {
            const navs = await this._navUpdateProvider.fetchNavHistories(fund.schemeCode);
            for (let data of navs) {
                const entity = toEntity({
                    nav: data.nav,
                    navDate: new Date(data.navDate),
                    schemeCode: data.schemeCode,
                    interval,
                    source: "MF_API",
                });
                try {
                    await this._mutualFundNavRepository.upsertDocument(entity);
                } catch (error) {
                    return
                }
            }
        }
    }
}   
