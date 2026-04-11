import { QueryOptions } from "mongoose";
import { AdminAlgoSignalResponseDTO } from "@application/dto/admin/algo-trading/algo-signal-response.dto";
import { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";

export interface IAdminGetSignalUseCase {
    execute(query: QueryOptions): Promise<FetchDataResponseDTO<AdminAlgoSignalResponseDTO>>;
}