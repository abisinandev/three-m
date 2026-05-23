import { QueryOptions } from "mongoose";
import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import { AdminAlgoTradeResponseDTO } from "@application/dto/admin/algo-trading/algo-trade-response.dto";

export interface IAdminGetAlgoTradesUseCase {
    execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminAlgoTradeResponseDTO>>;
}
