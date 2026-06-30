import { inject, injectable } from "inversify";
import { IAdminGetSignalUseCase } from "./interfaces/admin-get-signals-usecase.interface";
import { QueryOptions } from "mongoose";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoSignalRepository } from "@application/interfaces/repositories/algo/algo-signal-repository.interface";
import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import { AdminAlgoSignalResponseDTO } from "@application/dto/admin/algo-trading/algo-signal-response.dto";

@injectable()
export class AdminGetSignalUseCase implements IAdminGetSignalUseCase {

    constructor(
        @inject(STOCK_TYPES.AlgoSignalRepository) private readonly _getSignals: IAlgoSignalRepository,
    ){}

    async execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminAlgoSignalResponseDTO>> {
        const signals = await this._getSignals.findAllSignalsWithFilter({
            page: query.page,
            limit: query.limit,
            search: query.search,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            filter: query.filter || {},
        });

        const totalCount = await this._getSignals.countSignals();

        const data: AdminAlgoSignalResponseDTO[] = signals.map(entity => ({
            symbol: entity.symbol,
            strategyName: entity.strategyName,
            action: entity.action,
            price: entity.price,
            reason: entity.reason,
            status: entity.status,
            createdAt: entity.createdAt,
            expiresAt: entity.expiresAt,
        }));

        return {
            data,
            total: totalCount,
            page: query.page || 1,
            limit: query.limit || 10,
            totalPages: Math.ceil(totalCount / (query.limit || 10)),
        };
    }
}