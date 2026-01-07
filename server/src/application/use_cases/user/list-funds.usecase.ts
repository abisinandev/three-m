import { inject, injectable } from "inversify";
import { IListFundsUserSideUseCase } from "../interfaces/features/mutual-funds/list-fund-usecase.interface";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { IMutualFundRepository } from "@application/interfaces/repositories/mutual-fund-repository.interface";
import { toMutualFundResponse } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { QueryOptions } from "mongoose";


@injectable()
export class ListFundUserSideUseCase implements IListFundsUserSideUseCase {
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
        recentNavUpdates?: number;
    }> {

        const filter: Record<string, unknown> = {};

        if (data.categories && data.categories.length > 0) {
            filter.category = { $in: data.categories };
        }

        const finalQueryOptions: QueryOptions = {
            ...data,
            filter,
        };

        const mutualFunds = await this._mutualFundRepository.findAllFunds(finalQueryOptions);
        const { countActiveFunds } = await this._mutualFundRepository.findActiveFunds();
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
        };
    }
}