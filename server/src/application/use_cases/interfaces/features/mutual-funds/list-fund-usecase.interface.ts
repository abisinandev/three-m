import { FundListDTO } from "@application/dto/mutual-funds/mutual-fund-response.dto";
import { QueryOptions } from "mongoose";

export interface IListFundsUserSideUseCase {
    execute(userId: string, data: QueryOptions): Promise<{
        data: FundListDTO[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        totalActiveFunds?: number;
        recentNavUpdates?: number;
        totalInvestments?: number;
    }>;
}