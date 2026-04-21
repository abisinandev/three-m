import { inject, injectable } from "inversify";
import { IRadeemInvestmentUseCase } from "../interfaces/redeem-investments-usecase.interface";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { RadeemDTO } from "@application/dto/portfolio/radeem.dto";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class RadeemInvestmentUseCase implements IRadeemInvestmentUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navProvider: IMutualFundNavUpdateProvider,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { }

    async execute(userId: string): Promise<RadeemDTO[]> {

        const groupedFunds = await this._investmentRepository.findGroupedInvestmentsByUser(userId) ?? [];
        const data: RadeemDTO[] = [];

        for (const fundGroup of groupedFunds) {

            const fund = await this._mutualFundRepository.findBySchemeCode(fundGroup.schemeCode);
            if (!fund) continue;

            const latestNav = await this._navProvider.fetchNavHistories(fundGroup.schemeCode);
            const nav = latestNav[0]?.nav ?? 0;
            const currentValue = fundGroup.totalUnits * nav;
            const profit = currentValue - fundGroup.totalInvestment;
            data.push({
                mfId: fund.id as string,
                schemeName: fund.schemeName,
                schemeCode: fund.schemeCode,
                amc: fund.amc,
                category: fund.category,
                logo: fund.logo,
                nav,
                navDate: latestNav[0]?.navDate as string,
                totalInvestment: fundGroup.totalInvestment,
                currentValue,
                profit,
                totalUnits: fundGroup.totalUnits,
                risk: fund.risk,
                status: fund.status,
                createdAt: fund.createdAt as Date,
                updatedAt: fund.updatedAt as Date,
                roi:5,
            });
        }

        return data;
    }

    

}