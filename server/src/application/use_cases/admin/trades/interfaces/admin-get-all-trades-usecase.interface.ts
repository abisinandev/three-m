import { QueryOptions } from "mongoose";
import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import { AdminTradeResponseDTO } from "@application/dto/admin/trades/admin-trade-response.dto";

export interface IAdminGetAllTradesUseCase {
    execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminTradeResponseDTO>>;
}
