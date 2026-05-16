import { inject, injectable } from "inversify";
import { IListFundsUserSideUseCase } from "./interfaces/list-fund-usecase.interface";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { toMutualFundResponse } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { QueryOptions } from "mongoose";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IMutualFundNavService } from "@application/services/mutual-fund/interfaces/mutual-fund-nav.service.interface";


@injectable()
export class ListFundUserSideUseCase implements IListFundsUserSideUseCase {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.MfCagrRepository) private readonly _mfCagrRepository: IMfCagrRepository,
        @inject(MUTUAL_FUND_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavService) private readonly _navService: IMutualFundNavService,

    ) { };

    async execute(userId: string, data: any): Promise<{
        data: FundListDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        totalActiveFunds?: number;
        recentNavUpdates?: number;
        totalInvestments?: number;
    }> {

        const filter: Record<string, unknown> = {};
        if (data.categories && data.categories.length > 0) {
            filter.category = { $in: data.categories };
        }

        const finalQueryOptions: QueryOptions = {
            ...data,
            filter,
        };

        const { funds, countActiveFunds } = await this._mutualFundRepository.findActiveFunds(finalQueryOptions);
        const totalInvestments = await this._investmentRepository.findByUsertotalInvestments(userId);
        const { totalCount } = await this._mutualFundRepository.count();
        const totalPages = Math.ceil(totalCount / (Number(data.limit) || 10));
        const mfCagrs = await this._mfCagrRepository.findAll();

        const fundLists = await Promise.all(
            funds.map(async (fund) => {
                const nav = await this._navService.getLatestNav(fund.schemeCode);
                const cagr = mfCagrs.find((c) => c.schemeCode === fund.schemeCode);

                return {
                    ...toMutualFundResponse(fund, cagr),
                    nav: nav.nav,
                    navDate: nav.navDate,
                    latestNav: nav,
                };
            })
        );

        return {
            data: fundLists,
            limit: Number(data.limit) || 10,
            page: Number(data.page) || 1,
            totalPages,
            total: totalCount,
            totalActiveFunds: countActiveFunds,
            recentNavUpdates: 0,
            totalInvestments,
        };
    }
}