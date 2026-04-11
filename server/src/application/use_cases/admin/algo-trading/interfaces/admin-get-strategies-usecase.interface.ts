import { AlgoStrategyResponseDTO } from "@application/dto/admin/algo-trading/algo-strategy-response.dto";
import { QueryOptions } from "mongoose";

export interface IAdminGetStrategiesUseCase {
    execute(query: QueryOptions): Promise<{
        data: AlgoStrategyResponseDTO[],
        total: number,
        page: number,
        limit: number,
        totalPages: number;
    }>;
}