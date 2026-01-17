import { inject, injectable } from "inversify";
import { IPortfolioDetailsUseCase } from "../interfaces/features/portfolio/portfolio-details-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { toInvestmentResponse } from "@application/mappers/mutual-fund/investment.mapper";
import { InvestmentResponseDTO } from "@application/dto/mutual-funds/investment-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { QueryOptions } from "mongoose";
import { IMutualFundNavUpdateProvider } from "@application/interfaces/services/externals/mutual-fund-nav-update-provider.interface";
import { InvestmentStatus } from "@domain/enum/funds/investment.enums";

@injectable()
export class PortfolioDetailsUseCase implements IPortfolioDetailsUseCase {
    constructor(
        @inject(FEATURE_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(FEATURE_TYPES.NavUpdateProvider) private readonly _navUpdateProvider: IMutualFundNavUpdateProvider,
    ) { }

    async execute(
        userId: string,
        options: QueryOptions
    ): Promise<{
        data: InvestmentResponseDTO[];
        page: number;
        limit: number;
        totalCount: number;
        totalInvestment: number;
        totalProfit: number;
    }> {
        const { page = 1, limit = 10 } = options;
        const investments = (await this._investmentRepository.getUserInvestments(userId, options)) ?? [];
        const totalInvestment = await this._investmentRepository.findByUsertotalInvestments(userId);
        const totalCount = await this._investmentRepository.countByUser(userId);
        let totalProfit = 0;

        const data: InvestmentResponseDTO[] = [];

        for (const inv of investments) {
            const latestNav = await this._navUpdateProvider.fetchNavHistories(inv.schemeCode);
            const fund = await this._mutualFundRepository.findBySchemeCode(inv.schemeCode);
            if (!fund) continue;

            let profit = 0;
            if (inv.units > 0) {
                profit = ((inv.units as number) * (latestNav[0]?.nav ?? 0) - inv.amount) || 0;
            };

            if (inv.status === InvestmentStatus.ALLOTTED) {
                totalProfit += profit;
            }
            
            data.push(toInvestmentResponse(inv, fund, profit));
        }

        return {
            data,
            page,
            limit,
            totalCount,
            totalInvestment,
            totalProfit,
        };
    }
}