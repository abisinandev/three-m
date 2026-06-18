import { injectable, inject } from "inversify";
import { IAdminGetStrategiesUseCase } from "./interfaces/admin-get-strategies-usecase.interface";
import { QueryOptions } from "mongoose";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { IAlgoStrategyRepository } from "@application/interfaces/repositories/algo/algo-strategy-repository.interface";
import { AlgoStrategyResponseDTO } from "@application/dto/admin/algo-trading/algo-strategy-response.dto";

@injectable()
export class AdminGetStrategiesUseCase implements IAdminGetStrategiesUseCase {

    constructor(
        @inject(STOCK_TYPES.AlgoStrategyRepository) private readonly _strategyRepository: IAlgoStrategyRepository,
    ) { }

    async execute(query: QueryOptions): Promise<{
        data: AlgoStrategyResponseDTO[],
        total: number,
        page: number,
        limit: number,
        totalPages: number;
    }> {
        const strategies = await this._strategyRepository.findWithFilters({
            page: query.page,
            limit: query.limit,
            search: query.search,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            filter: query.filter || {},
        });

        const totalCount = await this._strategyRepository.countActiveStrategies();

        const data: AlgoStrategyResponseDTO[] = strategies.map(entity => ({
            id: String(entity.id).slice(17).toLocaleUpperCase(),
            userId: entity.userId,
            symbol: entity.symbol,
            strategyName: entity.strategyName,
            config: entity.config,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            usersCount: 0,
            lastSignalTime: null,
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