import { inject, injectable } from "inversify";
import { IMutualFundNavUpdatesUseCase } from "../interfaces/features/mutual-funds/mutual-fund-nav-udpate-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/mutual-fund-nav-repository.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/mutual-fund-repository.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { toEntity } from "@application/mappers/mutual-fund/mf-nav.mapper";

@injectable()
export class MutualFundNavUpdate implements IMutualFundNavUpdatesUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(FEATURE_TYPES.MutualFundNavRepsitory) private readonly _mutualFundNavRepository: IMutualFundNavRepository,
        @inject(FEATURE_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(): Promise<void> {

        const { funds } = await this._mutualFundRepository.findInactiveFunds();
        for (const fund of funds) {
            const result = await this._navUpdateProvider.fetchLatestNav(fund.schemeCode);

            const entity = toEntity({
                nav: result[0].nav,
                navDate: new Date(result[0].navDate),
                schemeCode: result[0].schemeCode,
                source: "MF_API",
            });

            try {
                await this._mutualFundNavRepository.create(entity);
            } catch (error) {
                return
            }
        }
    }
}
