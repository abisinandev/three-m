import type { FetchDataResponseDTO } from "@application/dto/admin/fetch-data.response.dto";
import type { UserDTO } from "@application/dto/user/user-dto";
import type { QueryOptions } from "mongoose";

export interface IFetchUserDetails {
  execute(data: QueryOptions): Promise<FetchDataResponseDTO<UserDTO>>;
}
