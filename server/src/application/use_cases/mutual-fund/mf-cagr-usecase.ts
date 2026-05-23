import { inject, injectable } from "inversify";
import { IMfCagrUseCase } from "./interfaces/mf-cagr-usecse.interface";
import { IMutualFundNavUpdateProvider, ParsedNav } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { MfCagrEntity } from "@domain/entities/mutual-fund/cagr-entity";
import { Cagr } from "@domain/entities/mutual-fund/value-objects/cagr-calculation.vo";
import { findOldNav } from "@shared/utils/mutual-fund/nav-cagr-utils";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class MfCagrUseCase implements IMfCagrUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.MfCagrRepository) private readonly _mfCagrRepository: IMfCagrRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(): Promise<void> {
        const { funds } = await this._mutualFundRepository.findActiveFunds();

        for (const fund of funds) {
            const result = await this._navUpdateProvider.fetchNavHistories(fund.schemeCode);
            const parsedNavs: ParsedNav[] = result.map(item => ({
                date: new Date(item.navDate),
                nav: item.nav
            }));

            const oneYear = findOldNav(parsedNavs, 1);
            const threeYear = findOldNav(parsedNavs, 3);
            const fiveYear = findOldNav(parsedNavs, 5);

            const entity = MfCagrEntity.create({
                schemeCode: fund.schemeCode,
                cagr1Y: Cagr.calculate({
                    startNav: Number(oneYear?.nav),
                    endNav: result[0].nav,
                    years: 1
                }),

                cagr3Y: Cagr.calculate({
                    startNav: Number(threeYear?.nav),
                    endNav: result[0].nav,
                    years: 3
                }),

                cagr5Y: Cagr.calculate({
                    startNav: Number(fiveYear?.nav),
                    endNav: result[0].nav,
                    years: 5
                }),
            });
            await this._mfCagrRepository.upsertBySchemeCode(entity);
        }
    }
}