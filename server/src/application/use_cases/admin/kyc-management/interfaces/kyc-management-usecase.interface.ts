import type { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import type { KycResponseDTO } from "@application/dto/user/kyc-response.dto";
import type { QueryOptions } from "mongoose";

export interface IFetchAllKycDocsUseCase {
  execute(data: QueryOptions): Promise<FetchDataResponseDTO<KycResponseDTO>>;
}
