import { inject, injectable } from "inversify";
import { IFetchAllFundsUseCases } from "./interfaces/fetch-all-funds-usecase.interface";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { toMutualFundResponse } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { QueryOptions } from "mongoose";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";

@injectable()
export class FetchAllFundUseCases implements IFetchAllFundsUseCases {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
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
        const mutualFunds = await this._mutualFundRepository.findAllFunds(data);
        const { countActiveFunds } = await this._mutualFundRepository.findActiveFunds();
        const { countInactiveFunds } = await this._mutualFundRepository.findInactiveFunds();
        const { totalCount } = await this._mutualFundRepository.count();
        const totalPages = Math.ceil(totalCount / (data.limit || 10));

        return {
            data: mutualFunds.map(data => toMutualFundResponse(data)),
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