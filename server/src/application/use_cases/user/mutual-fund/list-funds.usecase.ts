import { inject, injectable } from "inversify";
import { IListFundsUserSideUseCase } from "../../mutual-fund/interfaces/list-fund-usecase.interface";
import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { FEATURE_TYPES } from "@infrastructure/inversify_di/types/feature/feature.type";
import { toMutualFundResponse } from "@application/mappers/mutual-fund/mutual-fund.mapper";
import { QueryOptions } from "mongoose";
import { IMutualFundRepository } from "@application/interfaces/repositories/feature/mutual-fund-repository.interface";
import { IMfCagrRepository } from "@application/interfaces/repositories/feature/mf-cagr-repository.interface";
import { IInvestmentRepository } from "@application/interfaces/repositories/feature/investment-repository.interface";


@injectable()
export class ListFundUserSideUseCase implements IListFundsUserSideUseCase {
    constructor(
        @inject(FEATURE_TYPES.MutualFundRepository) private readonly _mutualFundRepository: IMutualFundRepository,
        @inject(FEATURE_TYPES.MfCagrRepository) private readonly _mfCagrRepository: IMfCagrRepository,
        @inject(FEATURE_TYPES.InvestmentRepository) private readonly _investmentRepository: IInvestmentRepository,
    ) { };

    async execute(userId: string, data: QueryOptions): Promise<{
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
        const totalPages = Math.ceil(totalCount / (data.limit || 10));
        const mfCagrs = await this._mfCagrRepository.findAll();

        return {
            data: funds.map(data => toMutualFundResponse(data,
                mfCagrs.find(cagr => cagr.schemeCode === data.schemeCode))
            ),
            limit: data.limit || 10,
            page: data.page || 1,
            totalPages,
            total: totalCount,
            totalActiveFunds: countActiveFunds,
            recentNavUpdates: 0,
            totalInvestments,
        };
    }
}