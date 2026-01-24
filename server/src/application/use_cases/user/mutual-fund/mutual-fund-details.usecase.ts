import { FundDetailsDTO } from "@application/dto/mutual-funds/fund-details.dto";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IMutualFundNavRepository } from "@application/interfaces/repositories/feature/mutual-fund-nav-repository.interface";
import { IMutualFundDetailsUseCase } from "@application/use_cases/mutual-fund/interfaces/mutual-fund-details-usecase.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import { NavInterval } from "@domain/enum/funds/nav-intervals.enums";
import { MutualFundRepository } from "@infrastructure/databases/repository/mutual-fund/mutual-fund.repostiory";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { NotFoundError } from "@presentation/express/utils/error-handling";
import { calculateReturn } from "@shared/utils/mutual-fund/return-calculation";
import { inject, injectable } from "inversify";

@injectable()
export class MutualFundDetailsUseCase implements IMutualFundDetailsUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: MutualFundRepository,
        @inject(FEATURE_TYPES.MfCagrRepository) private readonly _mfCagrRepository: IMfCagrRepository,
        @inject(FEATURE_TYPES.MutualFundNavRepository) private readonly _mfNavRepository: IMutualFundNavRepository,
    ) { };

    async execute(schemeCode: string, interval: NavInterval): Promise<FundDetailsDTO> {
        const fund = await this._mutualFundRepository.findBySchemeCode(schemeCode);
        if (!fund) throw new NotFoundError(ErrorMessage.NOT_FOUND);

        const mfCagrs = await this._mfCagrRepository.findOne({ schemeCode });
        const navHistories = await this._mfNavRepository.findByInterval(schemeCode, interval, 300) ?? [];
        const absoluteReturn = calculateReturn(navHistories);
        return {
            id: fund.id!,
            schemeCode: fund.schemeCode,
            schemeName: fund.schemeName,
            amc: fund.amc,
            category: fund.category,
            subCategory: fund.subCategory,

            nav: fund.latestNav?.nav ?? 0,
            navDate: fund.latestNav?.navDate ?? new Date(0),

            cagr: mfCagrs
                ? {
                    cagr1Y: mfCagrs?.cagr1Y,
                    cagr3Y: mfCagrs?.cagr3Y,
                    cagr5Y: mfCagrs?.cagr5Y,
                    updatedAt: mfCagrs?.updatedAt,
                } : null,

            risk: fund.risk,
            status: fund.status,

            logo: fund.logo,
            createdAt: fund.createdAt!,
            updatedAt: fund.updatedAt!,
            absoluteReturn,
            navHistory: navHistories.map(nav => ({
                nav: nav.nav,
                navDate: nav.navDate,
                interval: nav.interval,
            })),
        };
    }
}