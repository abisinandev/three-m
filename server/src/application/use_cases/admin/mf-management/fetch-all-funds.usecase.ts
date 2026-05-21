import { inject, injectable } from "inversify";
import { IFetchAllFundsUseCases } from "./interface/fetch-all-funds-usecase.interface";
import { toMutualFundResponse } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { QueryOptions } from "mongoose";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { MUTUAL_FUND_TYPES } from "@infrastructure/inversify_di/features/mutual-fund/mutual-fund.types";
import { IMutualFundNavService } from "@application/services/mutual-fund/interfaces/mutual-fund-nav.service.interface";

@injectable()
export class FetchAllFundUseCases implements IFetchAllFundsUseCases {
    constructor(
        @inject(MUTUAL_FUND_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(MUTUAL_FUND_TYPES.MutualFundNavService) private readonly _navService: IMutualFundNavService
    ) { };

    async execute(data: QueryOptions): Promise<{
        data: FundListDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        totalActiveFunds?: number;
        totalInactiveFunds?: number;
        recentNavUpdates?: number;
    }> {
        const mf = await this._mutualFundRepository.findAllFunds(data);
        const mutualFunds = await Promise.all(
            mf.map(async (fund) => {
                try {
                    const latest = await this._navService.getLatestNav(fund.schemeCode);
                    return {
                        ...toMutualFundResponse(fund),
                        nav: latest.nav,
                        navDate: latest.navDate,
                        latestNav: latest,
                    };
                } catch (error) {
                    return toMutualFundResponse(fund);
                }
            })
        );

        const { countActiveFunds } = await this._mutualFundRepository.findActiveFunds();
        const { countInactiveFunds } = await this._mutualFundRepository.findInactiveFunds();
        const { totalCount } = await this._mutualFundRepository.count();
        const totalPages = Math.ceil(totalCount / (data.limit || 10));

        return {
            data: mutualFunds,
            limit: data.limit || 10,
            page: data.page || 1,
            totalPages,
            total: totalCount,
            totalActiveFunds: countActiveFunds,
            recentNavUpdates: 0,
            totalInactiveFunds: countInactiveFunds,
        }
    }
}