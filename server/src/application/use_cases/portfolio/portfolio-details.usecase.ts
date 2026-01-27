import { inject, injectable } from "inversify";
import { IPortfolioDetailsUseCase } from "./interfaces/portfolio-details-usecase.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { QueryOptions } from "mongoose";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";

@injectable()
export class PortfolioDetailsUseCase implements IPortfolioDetailsUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(
        userId: string,
        options: QueryOptions
    ): Promise<{
        data: InvestmentResponseDTO[];
        page: number;   
        limit: number;
    }> {
        const { page = 1, limit = 10 } = options;
        const investments = (await this._investmentRepository.getUserInvestments(userId, options)) ?? [];

        const data: InvestmentResponseDTO[] = [];
        for (const inv of investments) {
            const latestNav = await this._navUpdateProvider.fetchNavHistories(inv.schemeCode);
            const fund = await this._mutualFundRepository.findBySchemeCode(inv.schemeCode);
            if (!fund) continue;
            let profit = 0;

            if (inv.status === InvestmentStatus.ALLOTTED && Number(inv.units) > 0) {
                profit =
                    Number(
                        ((Number(inv.units) * latestNav[0].nav)) - inv.amount
                    );
            }
            data.push(toInvestmentResponse(inv, fund, profit));
        }

        return {
            data,
            page,
            limit,
        };
    }
}